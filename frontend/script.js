// ======================
// TOGGLE LOGIN REGISTER
// ======================

if(!localStorage.getItem("user")){

    localStorage.setItem(
        "user",
        JSON.stringify({
            username: " ",
            email: "demo@gmail.com",
            password: "demo123"
        })
    );
}
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

// function showRegister() {

//     document.getElementById('registerForm')
//         .classList.remove('hidden');

//     document.getElementById('loginForm')
//         .classList.add('hidden');

//     document.getElementById('registerBtn')
//         .classList.add('active');

//     document.getElementById('loginBtn')
//         .classList.remove('active');
// }

// ======================
// REGISTER
// ======================

// async function register() {

//     const username = document.getElementById("username").value.trim();
//     const email = document.getElementById("email").value.trim();
//     const password = document.getElementById("password").value.trim();
//     const message = document.getElementById("message");

//     // Username validation
//     message.innerHTML = "";
//     message.style.color = "";

//     if(username.length < 3){
//         message.innerHTML = "Username must contain at least 3 characters";
//         message.style.color = "red";
//         return;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if(!emailRegex.test(email)){
//         message.innerHTML = "Enter a valid email address";
//         message.style.color = "red";
//         return;
//     }

//     // Password validation
//     if(password.length < 6){
//         message.innerHTML = "Password must be at least 6 characters";
//         message.style.color = "red";
//         return;
//     }

//     const user = {
//         username,
//         email,
//         password
//     };

//     localStorage.setItem(
//         "user",
//         JSON.stringify(user)
//     );

//     message.innerHTML =
//         "Registration Successful!";

//     message.style.color =
//         "lime";

//     setTimeout(() => {

//         showLogin();

//     }, 1500);
// }

// ======================
// LOGIN
// ======================

async function login() {

    const email =
        document.getElementById('login_email')
        .value.trim();

    const password =
        document.getElementById('login_password')
        .value.trim();

    // Validation
    if(email === "" || password === ""){

        alert("Please fill all fields");
        return;
    }

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if(
        user &&
        email === user.email &&
        password === user.password
    ){

        localStorage.setItem(
            'username',
            user.username
        );
<<<<<<< HEAD
        localStorage.setItem(
            'username',
            data.username
        );
        window.location.href = 'dashboard.html';
=======

        window.location.href =
            'dashboard.html';
>>>>>>> 76395ef329b603547a70f0cc06005d3c1e1c087d

    } else {

        alert("Invalid Credentials");
    }
}
function demoLogin(){

    document.getElementById(
        'login_email'
    ).value = "demo@gmail.com";

    document.getElementById(
        'login_password'
    ).value = "demo123";

    alert(
        "Demo credentials loaded!"
    );
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


    const response = await fetch(
        'https://ai-api-testing.onrender.com/test_api',
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                url,
                method,
                headers,
                body
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
    let history = JSON.parse(
        localStorage.getItem("history")
    ) || [];

    history.unshift({

        method: method,

        url: url,

        status: data.response.status_code,

        result: data.result || "Success"

    });

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    loadHistory();
}

// ======================
// LOAD HISTORY
// ======================

function loadHistory() {

    let history = JSON.parse(
        localStorage.getItem("history")
    ) || [];

    let rows = '';

    history.forEach(item => {

        rows += `
            <tr>
                <td>${item.method}</td>
                <td>${item.url}</td>
<<<<<<< HEAD
=======

>>>>>>> 76395ef329b603547a70f0cc06005d3c1e1c087d
                <td>
                    <span class="badge badge-${item.status}">
                        ${item.status}
                    </span>
                </td>
<<<<<<< HEAD
                <td>${item.result}</td>
            </tr>
            `;
=======

                <td>${item.result}</td>
            </tr>
        `;
>>>>>>> 76395ef329b603547a70f0cc06005d3c1e1c087d
    });

    const table = document.getElementById('historyTable');

    if(table){
        table.innerHTML = rows;
    }
}

<<<<<<< HEAD
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
=======
// ======================
// PAGE LOAD
// ======================
>>>>>>> 76395ef329b603547a70f0cc06005d3c1e1c087d

window.onload = function(){

    const username =
        localStorage.getItem('username');

    if(username){

        document.getElementById('welcome')
            .innerText =
            "Welcome, " + username + " 👋";
    }

    loadHistory();
};
// ======================
// LOGOUT
// ======================

function logout() {
    localStorage.removeItem("username");
    window.location.href = "index.html";
}