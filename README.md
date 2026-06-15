# 🚀 AI-Enhanced API Testing & Development Tool

![Python](https://img.shields.io/badge/Python-3.12-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)
![AI](https://img.shields.io/badge/AI-DeepSeek-red)
![ML](https://img.shields.io/badge/ML-RandomForest-purple)

An intelligent API testing platform that integrates **Artificial Intelligence (AI)** and **Machine Learning (ML)** to simplify API debugging, predict API behavior, and maintain API history.

Traditional API testing tools such as Postman provide request and response handling but lack intelligent assistance. This project bridges that gap by providing AI-powered analysis and ML-based predictions.

---

## 📌 Problem Statement

Developers often spend significant time understanding API errors and debugging issues manually. Existing API testing tools do not provide:

* AI-powered debugging
* Error explanations
* Security recommendations
* ML-based predictions
* API history tracking

Our solution enhances API testing by integrating AI and Machine Learning into the development workflow.

---

## ✨ Key Features

✅ User Authentication (Login/Register)

✅ API Testing (GET, POST, PUT, DELETE)

✅ AI-Powered Error Analysis

✅ Machine Learning Prediction

✅ API Request History Tracking

✅ Dashboard Analytics

✅ Cloud Deployment Support

✅ Security Recommendations

---

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Python
* Flask
* Requests Library
* Flask-CORS

### Database

* MySQL
* Railway MySQL

### Machine Learning

* Scikit-learn
* Random Forest Classifier
* Pandas
* NumPy
* Joblib

### Generative AI

* OpenRouter API
* DeepSeek AI

### Deployment

* Vercel (Frontend)
* Render (Backend)
* Railway (Database)

---

## 🏗️ System Architecture

```text
Frontend (HTML/CSS/JS)
        ↓
Flask Backend (Python)
        ↓
Requests Library
        ↓
ML Prediction
        ↓
DeepSeek AI Analysis
        ↓
MySQL Database
        ↓
Dashboard & History
```

---

## 🔄 Working Flow

### Step 1: User Authentication

Users create an account or log in securely.

### Step 2: API Input

Users provide:

* API URL
* HTTP Method
* Headers
* Request Body

Example:

```text
URL: https://jsonplaceholder.typicode.com/posts
Method: GET
```

### Step 3: API Testing

The Flask backend sends API requests using Python's `requests` library and retrieves the response.

### Step 4: ML Prediction

The Random Forest model analyzes API features such as:

* HTTP Status Code
* Payload Size
* Response Time

Predictions:

* Success
* Client Error
* Server Error

### Step 5: AI Analysis

API responses are sent to DeepSeek AI through OpenRouter API.

AI provides:

* Error explanations
* Debugging suggestions
* Security recommendations

Example:

```text
Error: Missing Authentication Token

Suggestion:
Add Authorization header with API key.
```

### Step 6: Store History

All API requests are stored in MySQL, including:

* URL
* Method
* Status Code
* Result
* AI Analysis
* Timestamp

Users can view their API testing history through the dashboard.

---

## 📂 Project Structure

```text
AI_API_TESTING_TOOL/
│
├── backend/
│   ├── .env
│   ├── app.py
│   ├── model.pkl
│   ├── Procfile
│   ├── requirements.txt
│   └── runtime.txt
│
├── database/
│   ├── api_testing.sql
│   └── database.sql
│
├── frontend/
│   ├── dashboard.html
│   ├── history.html
│   ├── login.html
│   ├── register.html
│   ├── script.js
│   └── style.css
│
├── ml/
│   ├── dataset.csv
│   ├── model.pkl
│   └── train_model.py
│
├── project_Documentation.docx
└── README.md
```

---

## ⚙️ Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/your-username/AI_API_TESTING_TOOL.git
cd AI_API_TESTING_TOOL
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
OPENROUTER_API_KEY=your_api_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=api_testing
```

### Run the Flask Server

```bash
python app.py
```

Application runs at:

```text
http://localhost:5000
```

---

## 📊 Machine Learning Model

**Algorithm Used:** Random Forest Classifier

**Features Used:**

* HTTP Status Code
* Payload Size
* Response Time

**Output Classes:**

* Success
* Client Error
* Server Error

---

## ☁️ Deployment

| Service  | Platform      |
| -------- | ------------- |
| Frontend | Vercel        |
| Backend  | Render        |
| Database | Railway MySQL |

---

## 🔮 Future Enhancements

* Swagger/OpenAPI Integration
* JWT Authentication
* API Load Testing
* Docker Support
* Team Collaboration
* Real-time API Monitoring

---

## 👨‍💻 Author

**Chethan Reddy Gagenapally**

B.Tech – CSM
CMR Technical Campus (CMRTC)

GitHub: https://github.com/Chethanreddy1112

LinkedIn: https://www.linkedin.com/in/chethan-reddy-gagenapally-199a51291/

---

## 📜 License

This project is developed for educational and research purposes.
