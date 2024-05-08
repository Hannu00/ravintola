'use strict';

const loginForm = document.getElementById("loginForm");

let message = document.querySelector("#status-message");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = loginForm.email.value;
    let password = loginForm.password.value;
    postLogin(email, password)
})

const postLogin = async (email, password) => {
    try {
        const response = await fetch('http://10.120.32.55/app/api/v1/auth/login', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
        const data = await response.json();
        if (response.status === 200) {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));
            message.innerHTML = data.message + ", redirecting..."

            // Check if there's an intended destination stored in the session storage
            const intendedDestination = sessionStorage.getItem("intendedDestination");
            if (intendedDestination) {
                // Redirect the user to the intended destination
                setTimeout(() => {
                    window.location.href = intendedDestination;
                }, 2000);
                // Clear the intended destination from the session storage
                sessionStorage.removeItem("intendedDestination");
            } else {
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            }
        } else {
            message.innerHTML = data.message;
        }
    } catch (error) {
        console.log(error);
    }
}