// const BACKEND_URL = "https://ai-api-testing.onrender.com";
const BACKEND_URL = "http://127.0.0.1:5000";

// ======================
// REGISTER
// ======================

async function register() {

    const username = document
        .getElementById("username")
        .value.trim();

    const email = document
        .getElementById("email")
        .value.trim();

    const password = document
        .getElementById("password")
        .value.trim();

    if (!username || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    try {

        const response = await fetch(
            `${BACKEND_URL}/register`,
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

        if (response.ok) {

            alert("Registration successful");
            showLogin();

        } else {

            alert(data.error || data.message);
        }

    } catch (error) {

        console.error(error);
        alert("Server Error");
    }
}


// ======================
// LOGIN
// ======================

async function login() {

    const email = document
        .getElementById("login_email")
        .value.trim();

    const password = document
        .getElementById("login_password")
        .value.trim();

    if (!email || !password) {

        alert("Please fill all fields");
        return;
    }

    try {

        const response = await fetch(
            `${BACKEND_URL}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (data.token) {

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "username",
                data.user.username
            );

            window.location.href =
                "dashboard.html";

        } else {

            alert(data.message || "Invalid credentials");
        }

    } catch (error) {

        console.error(error);
        alert("Server Error");
    }
}

function showRegister() {

    document
        .getElementById("loginForm")
        .classList.add("hidden");

    document
        .getElementById("registerForm")
        .classList.remove("hidden");
}

function showLogin() {

    document
        .getElementById("registerForm")
        .classList.add("hidden");

    document
        .getElementById("loginForm")
        .classList.remove("hidden");
}

// ======================
// SEND API REQUEST
// ======================

async function sendRequest() {

    const url =
        document.getElementById("url").value;

    const method =
        document.getElementById("method").value;

    const headers =
        document.getElementById("headers").value || "{}";

    const body =
        document.getElementById("body").value || "{}";

    try {

        JSON.parse(headers);
        JSON.parse(body);

    } catch {

        alert("Invalid JSON");
        return;
    }

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            `${BACKEND_URL}/test_api`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
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

        document.getElementById(
            "response"
        ).innerText = JSON.stringify(
            data.response || {},
            null,
            4
        );

        document.getElementById(
            "prediction"
        ).innerText =
            data.prediction || "No Prediction";

        document.getElementById(
            "ai"
        ).innerText =
            data.ai_suggestion || "No AI Suggestion";

        if (data.error) {
            alert(data.error);
        }

        loadHistory();

    } catch (error) {

        console.error(error);
        alert("Request Failed");
    }
}


// ======================
// LOAD HISTORY
// ======================

async function loadHistory() {

    const token =
        localStorage.getItem("token");

    if (!token) return;

    try {

        const response = await fetch(
            `${BACKEND_URL}/history`,
            {
                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

        const history =
            await response.json();

        let rows = "";

        history.forEach(item => {

            rows += `
            <tr>
                <td>${item.method}</td>

                <td>${item.api_url}</td>

                <td>
                    <span class="badge ${getBadgeClass(item.response_code)}">
                        ${item.response_code}
                    </span>
                </td>

                <td>${item.result}</td>

                <td>${new Date(item.created_at)
                        .toLocaleString()}</td>
            </tr>
            `;
        });

        const table =
            document.getElementById(
                "historyTable"
            );

        if (table) {
            table.innerHTML = rows;
        }

    } catch (error) {

        console.error(error);
    }
}


// ======================
// SHOW LOGIN
// ======================

function showLogin() {

    document
        .getElementById("loginForm")
        .classList.remove("hidden");

    document
        .getElementById("registerForm")
        .classList.add("hidden");
}


// ======================
// SHOW REGISTER
// ======================

function showRegister() {

    document
        .getElementById("registerForm")
        .classList.remove("hidden");

    document
        .getElementById("loginForm")
        .classList.add("hidden");
}


// ======================
// LOGOUT
// ======================

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "username"
    );

    window.location.href =
        "index.html";
}


// ======================
// PAGE LOAD
// ======================

window.onload = function () {

    const username =
        localStorage.getItem(
            "username"
        );

    const welcome =
        document.getElementById(
            "welcome"
        );

    if (username && welcome) {

        welcome.innerText =
            `Welcome, ${username} 👋`;
    }

    loadHistory();
};