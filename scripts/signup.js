'use strict';

const signupForm = document.getElementById("signupForm");

let message = document.querySelector("#status-message");


signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let firstName = signupForm.firstname.value;
    let lastName = signupForm.lastname.value;
    let email = signupForm.email.value;
    let phone = signupForm.phone.value;
    let address = signupForm.address.value;
    let password = signupForm.password.value;
    let confirmPassword = signupForm.confirmPassword.value;

    if (password !== confirmPassword) {
        message.innerHTML = "Passwords do not match";
        return;
    } else {
        postSignup(firstName, lastName, email, address, phone, password);
    }
});

const postSignup = async (firstName, lastName, email, phone, address, password) => {
    try {
        const response = await fetch('http://10.120.32.55/app/api/v1/users', {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
                address: address,
                password: password,
                role: "user",
            })
        })
        const data = await response.json();
        if (response.status === 201) {
            message.innerHTML = data.message + ", redirecting..."
            setTimeout(() => {
                window.location.href = "login_fi.html";
            }, 2000);
        } else {
            message.innerHTML = data.message;
        }
    } catch (error) {
    }
}