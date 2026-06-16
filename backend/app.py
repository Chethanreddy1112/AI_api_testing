from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import pandas as pd
import joblib
import os
import mysql.connector
import jwt
import datetime

from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv(
    "JWT_SECRET",
    "secret_key"
)

# =========================
# OPENROUTER
# =========================

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

# =========================
# MYSQL CONNECTION
# =========================

db = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT")),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)

cursor = db.cursor(dictionary=True)

print("✅ MySQL Connected")
# =========================
# CREATE TABLES
# =========================

cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS api_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    api_url TEXT,
    method VARCHAR(20),
    response_code INT,
    ai_suggestion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
)
""")

db.commit()

print("✅ Tables created successfully")


# =========================
# LOAD ML MODEL
# =========================

model = joblib.load("model.pkl")


# =========================
# JWT VERIFY
# =========================

def verify_token(token):

    try:

        data = jwt.decode(
            token,
            app.config['SECRET_KEY'],
            algorithms=["HS256"]
        )

        return data['user_id']

    except:
        return None


# =========================
# SAVE HISTORY
# =========================

# =========================
# SAVE HISTORY
# =========================

def save_history(
    user_id,
    api_url,
    method,
    response_code,
    result
):

    cur = db.cursor()

    cur.execute("""
        INSERT INTO api_history
        (
            user_id,
            api_url,
            method,
            response_code,
            result
        )
        VALUES (%s, %s, %s, %s, %s)
    """,
    (
        user_id,
        api_url,
        method,
        response_code,
        result
    ))

    db.commit()

    cur.close()

# =========================
# HOME
# =========================

@app.route('/')
def home():

    return jsonify({
        "message":
        "AI API Testing Tool Backend Running"
    })


# =========================
# REGISTER
# =========================

@app.route('/register', methods=['POST'])
def register():

    try:
        data = request.json

        print("REGISTER DATA:", data)

        username = data['username']
        email = data['email']
        password = data['password']

        hashed_password = generate_password_hash(
            password
        )

        cur = db.cursor()

        cur.execute("""
            INSERT INTO users
            (username, email, password)
            VALUES (%s, %s, %s)
        """, (
            username,
            email,
            hashed_password
        ))

        db.commit()

        cur.close()

        return jsonify({
            "success": True,
            "message": "Registration successful"
        })

    except Exception as e:

        print("REGISTER ERROR:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# =========================
# LOGIN
# =========================

@app.route('/login', methods=['POST'])
def login():

    try:

        data = request.json

        print("LOGIN DATA:", data)

        email = data['email']
        password = data['password']

        cur = db.cursor(dictionary=True)

        cur.execute(
            "SELECT * FROM users WHERE email=%s",
            (email,)
        )

        user = cur.fetchone()

        cur.close()

        if user and check_password_hash(
            user['password'],
            password
        ):

            token = jwt.encode(
                {
                    "user_id": user['id'],
                    "exp":
                    datetime.datetime.utcnow()
                    + datetime.timedelta(days=1)
                },
                app.config['SECRET_KEY'],
                algorithm="HS256"
            )

            return jsonify({
                "success": True,
                "token": token,
                "user": {
                    "id": user['id'],
                    "username": user['username']
                }
            })

        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

    except Exception as e:

        print("LOGIN ERROR:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# =========================
# TEST API
# =========================

@app.route('/test_api', methods=['POST'])
def test_api():

    try:

        data = request.json

        url = data['url']
        method = data['method']

        headers = {}

        if data['headers']:
            headers = json.loads(
                data['headers']
            )

        body = {}

        if data['body']:
            body = json.loads(
                data['body']
            )

        if method == "GET":

            res = requests.get(
                url,
                headers=headers
            )

        elif method == "POST":

            res = requests.post(
                url,
                headers=headers,
                json=body
            )

        elif method == "PUT":

            res = requests.put(
                url,
                headers=headers,
                json=body
            )

        elif method == "DELETE":

            res = requests.delete(
                url,
                headers=headers
            )

        else:

            return jsonify({
                "success": False,
                "error":
                "Invalid Method"
            })

        try:
            response_json = res.json()

        except:
            response_json = res.text

        payload_size = len(
            str(body)
        )

        feature_data = pd.DataFrame(
            [[payload_size,
              res.status_code]],
            columns=[
                'payload_size',
                'status_code'
            ]
        )

        prediction = model.predict(
            feature_data
        )[0]
        prediction = model
        prompt = f"""
        Analyze API response.

        URL: {url}
        METHOD: {method}
        STATUS: {res.status_code}

        RESPONSE:
        {response_json}

        Give:
        1. Error explanation
        2. Debugging tip
        3. Security tip
        """

        try:

            completion = client.chat.completions.create(
                model="deepseek/deepseek-chat",
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            ai_text = completion.choices[
                0
            ].message.content

        except Exception:

            ai_text = (
                "AI analysis unavailable."
            )

        # Save History
        token = request.headers.get(
            "Authorization"
        )

        if token:

            token = token.split(
                " "
            )[1]

            user_id = verify_token(
                token
            )

            if user_id:

                save_history(
                    user_id,
                    url,
                    method,
                    res.status_code,
                    ai_text
                )

        return jsonify({

            "success": True,

            "response": {
                "status_code": res.status_code,
                "response": response_json
            },

            "prediction": result,
            "result": result,

            # "ai_suggestion": ai_text
        })
    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        })


# =========================
# HISTORY
# =========================

@app.route('/history', methods=['GET'])
def history():

    token = request.headers.get(
        "Authorization"
    )

    if not token:

        return jsonify({
            "message":
            "Token missing"
        }), 401

    token = token.split(" ")[1]

    user_id = verify_token(
        token
    )

    if not user_id:

        return jsonify({
            "message":
            "Invalid token"
        }), 401

    cur = db.cursor(
        dictionary=True
    )

    cur.execute("""
        SELECT *
        FROM api_history
        WHERE user_id=%s
        ORDER BY created_at DESC
    """, (user_id,))

    history = cur.fetchall()

    cur.close()

    return jsonify(history)


# =========================
# RUN APP
# =========================

if __name__ == '__main__':

    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000
    )