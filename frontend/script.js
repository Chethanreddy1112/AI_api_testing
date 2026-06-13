// ======================
// TOGGLE LOGIN REGISTER
// ======================

function showLogin() {

    document.getElementById('loginForm')
        .classList.remove('hidden');

    document.getElementById('registerForm')
        .classList.add('hidden');

    document.getElementById('loginBtn')
        .classList.add('active');

    document.getElementById('registerBtn')
        .classList.remove('active');
}

function showRegister() {

    document.getElementById('registerForm')
        .classList.remove('hidden');

    document.getElementById('loginForm')
        .classList.add('hidden');

    document.getElementById('registerBtn')
        .classList.add('active');

    document.getElementById('loginBtn')
        .classList.remove('active');
}

// ======================
// REGISTER
// ======================

async function register() {

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    // Username validation
    message.innerHTML = "";
    message.style.color = "";

    if(username.length < 3){
        message.innerHTML = "Username must contain at least 3 characters";
        message.style.color = "red";
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        message.innerHTML = "Enter a valid email address";
        message.style.color = "red";
        return;
    }

    // Password validation
    if(password.length < 6){
        message.innerHTML = "Password must be at least 6 characters";
        message.style.color = "red";
        return;
    }

    try{

        const response = await fetch(
            "http://127.0.0.1:5000/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if(response.ok){
            message.innerHTML = "Registration successful!";
            message.style.color = "lime";

            setTimeout(()=>{
                window.location.href = "login.html";
            },1500);

        } else {
            message.innerHTML = data.message;
            message.style.color = "red";
        }

    } catch(error){
        message.innerHTML = "Server error";
        message.style.color = "red";
    }
}

// ======================
// LOGIN
// ======================

async function login() {

    const email =
        document.getElementById('login_email').value;

    const password =
        document.getElementById('login_password').value;

    const response = await fetch(
        'http://127.0.0.1:5000/login',
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await response.json();

    if(data.success) {

        localStorage.setItem(
            'user_id',
            data.user_id
        );
        localStorage.setItem(
            'username',
            data.username
        );
        window.location.href = 'dashboard.html';

    } else {

        alert('Invalid Credentials');
    }
}

// ======================
// SEND API REQUEST
// ======================

async function sendRequest() {

    const url =
        document.getElementById('url').value;

    const method =
        document.getElementById('method').value;

    let headers =
        document.getElementById('headers').value;

    let body =
        document.getElementById('body').value;

    try{
        JSON.parse(headers || "{}");
        JSON.parse(body || "{}");
    }
    catch(error){
        alert("Invalid JSON in Headers or Body");
        return;
    }

    const user_id =
        localStorage.getItem('user_id');

    const response = await fetch(
        'http://127.0.0.1:5000/test_api',
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                url,
                method,
                headers,
                body,
                user_id
            })
        }
    );

    const data = await response.json();

    console.log(data);

    // RESPONSE

    if(data.response){

        document.getElementById('response')
        .innerText = JSON.stringify(
            data.response,
            null,
            4
        );

    }else{

        document.getElementById('response')
        .innerText = "No Response";
    }

    // ML PREDICTION

    if(data.prediction){

        document.getElementById('prediction')
        .innerText = data.prediction;

    }else{

        document.getElementById('prediction')
        .innerText = "No Prediction";
    }

    // AI

    if(data.ai_suggestion){

        document.getElementById('ai')
        .innerText = data.ai_suggestion;

    }else{

        document.getElementById('ai')
        .innerText = "No AI Suggestion";
    }

    // ERROR

    if(data.error){

        alert(data.error);
    }

    loadHistory();
}

// ======================
// LOAD HISTORY
// ======================

async function loadHistory() {

    const user_id =
        localStorage.getItem('user_id');

    const response = await fetch(
        `http://127.0.0.1:5000/history/${user_id}`
    );

    const data = await response.json();

    let rows = '';

    data.history.forEach(item => {

        rows += `
            <tr>
                <td>${item.method}</td>
                <td>${item.url}</td>
                <td>
                    <span class="badge badge-${item.status}">
                        ${item.status}
                    </span>
                </td>
                <td>${item.result}</td>
            </tr>
            `;
    });

    document.getElementById('historyTable')
        .innerHTML = rows;
}

window.onload = function(){

    const username =
        localStorage.getItem('username');

    if(username){

        document.getElementById('welcome')
            .innerText =
            "Welcome, " + username + " 👋";
    }

    loadHistory();
}

loadHistory();

// ======================
// LOGOUT
// ======================

function logout() {

    localStorage.removeItem('user_id');

    window.location.href = 'login.html';
}