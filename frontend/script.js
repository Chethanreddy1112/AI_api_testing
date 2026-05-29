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

    const username =
        document.getElementById('username').value;

    const email =
        document.getElementById('email').value;

    const password =
        document.getElementById('password').value;

    const response = await fetch(
        'http://127.0.0.1:5000/register',
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                username,
                email,
                password
            })
        }
    );

    const data = await response.json();

    alert(data.message);

    showLogin();
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

    const headers =
        document.getElementById('headers').value;

    const body =
        document.getElementById('body').value;

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
            <td>${item.status}</td>
        </tr>
        `;
    });

    document.getElementById('historyTable')
        .innerHTML = rows;
}

loadHistory();

// ======================
// LOGOUT
// ======================

function logout() {

    localStorage.removeItem('user_id');

    window.location.href = 'login.html';
}