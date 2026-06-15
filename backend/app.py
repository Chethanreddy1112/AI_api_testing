from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import pandas as pd
import joblib
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


# =========================
# FLASK APP
# =========================

app = Flask(__name__)
CORS(app)

# =========================
# OPENROUTER + DEEPSEEK
# =========================
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")    

client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

# =========================
# MYSQL CONNECTION
# =========================



# =========================
# LOAD ML MODEL
# =========================

model = joblib.load('model.pkl')

# =========================
# HOME ROUTE
# =========================

@app.route('/')
def home():

    return jsonify({
        'message': 'AI API Testing Tool Backend Running'
    })

# =========================
# API TESTING
# =========================

@app.route('/test_api', methods=['POST'])
def test_api():

    try:

        data = request.json

        url = data['url']
        method = data['method']

        # =========================
        # HEADERS
        # =========================

        headers = {}

        if data['headers']:

            headers = json.loads(data['headers'])

        # =========================
        # BODY
        # =========================

        body = {}

        if data['body']:

            body = json.loads(data['body'])

        # =========================
        # SEND API REQUEST
        # =========================

        if method == 'GET':

            res = requests.get(
                url,
                headers=headers
            )

        elif method == 'POST':

            res = requests.post(
                url,
                headers=headers,
                json=body
            )

        elif method == 'PUT':

            res = requests.put(
                url,
                headers=headers,
                json=body
            )

        elif method == 'DELETE':

            res = requests.delete(
                url,
                headers=headers
            )

        else:

            return jsonify({
                'success': False,
                'error': 'Invalid HTTP Method'
            })

        # =========================
        # RESPONSE
        # =========================

        try:

            response_json = res.json()

        except:

            response_json = res.text

        response_data = {
            'status_code': res.status_code,
            'response': response_json
        }
        status = res.status_code

        if status == 200:
            result = "Success"

        elif status == 201:
            result = "Created Successfully"

        elif status == 400:
            result = "Bad Request"

        elif status == 401:
            result = "Authentication Error"

        elif status == 403:
            result = "Forbidden"

        elif status == 404:
            result = "Endpoint Not Found"

        elif status == 405:
            result = "Method Not Allowed"

        elif status == 429:
            result = "Rate Limit Exceeded"

        elif 400 <= status < 500:
            result = "Client Error"

        elif 500 <= status < 600:
            result = "Server Error"

        else:
            result = "Unknown"

        # =========================
        # MACHINE LEARNING
        # =========================

        payload_size = len(str(body))

        feature_data = pd.DataFrame(
            [[payload_size, res.status_code]],
            columns=[
                'payload_size',
                'status_code'
            ]
        )

        prediction = model.predict(feature_data)[0]

        # =========================
        # OPTIMIZED AI PROMPT
        # FIX 1 + FIX 2
        # =========================

        prompt = f"""
        Analyze this API response briefly.

        URL: {url}
        METHOD: {method}
        STATUS: {res.status_code}

        RESPONSE:{response_json}

        Give:
        1. Error explanation
        2. Debugging tip
        3. Security tip
        """

        # =========================
        # DEEPSEEK AI
        # FIX 3
        # =========================

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

            ai_text = completion.choices[0].message.content

        except Exception as ai_error:

            print("AI ERROR:", ai_error)

            # FALLBACK AI RESPONSE

            if res.status_code == 200:

                ai_text = "API working successfully."

            elif res.status_code == 201:

                ai_text = "Data created successfully."

            elif res.status_code == 400:

                ai_text = "Bad request detected. Check request body."

            elif res.status_code == 401:

                ai_text = "Authentication failed. Verify API token."

            elif res.status_code == 403:

                ai_text = "Access forbidden."

            elif res.status_code == 404:

                ai_text = "Endpoint not found."

            elif res.status_code >= 500:

                ai_text = "Server-side error occurred."

            else:

                ai_text = "Check API configuration."

        # =========================
        # RESPONSE SUMMARY
        # =========================

        if isinstance(response_json, list):

            response_summary = f"{len(response_json)} records received"

        elif isinstance(response_json, dict):

            response_summary = "JSON object received"

        else:

            response_summary = "Text response received"

        # =========================
        # FINAL RESPONSE
        # =========================

        return jsonify({
            'success': True,
            'response': response_data,
            'prediction': str(prediction),
            'result': result,
            'ai_suggestion': ai_text
        })

    except Exception as e:

        return jsonify({
            'success': False,
            'error': str(e)
        })

# =========================
# API HISTORY
# =========================


# =========================
# RUN APP
# =========================

if __name__ == '__main__':

    app.run(
        debug=True,
        host='0.0.0.0',
        port=5000
    )