'use strict';

import {postLogin} from "./api/fetchCalls.js";

const loginForm = document.getElementById("loginForm");
let message = document.querySelector("#status-message");

const handleResponse = async (data) => {
    if (data.status === 200) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        message.innerHTML = data.message + ", redirecting..."
        const intendedDestination = sessionStorage.getItem("intendedDestination");
        if (intendedDestination) {
            setTimeout(() => {
                window.location.href = intendedDestination;
            }, 2000);
            sessionStorage.removeItem("intendedDestination");
        } else {
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        }
    } else {
        message.innerHTML = data.message;
    }
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = loginForm.email.value;
    let password = loginForm.password.value;
    postLogin(email, password).then(data => handleResponse(data));
});