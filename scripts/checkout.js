'use strict';
import {postOrder} from "./api/fetchCalls.js";

let user, shoppingCart, orderForm = document.getElementById("order-form");
const modal = document.querySelector(".modal");

const closeButton = document.querySelector(".close");

closeButton.addEventListener("click", function() {
    modal.style.display = "none";
});

window.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

export const createUserData = (user) => {
    orderForm.firstname.value = user.first_name;
    orderForm.lastname.value = user.last_name;
    orderForm.email.value = user.email;
    orderForm.phone.value = user.phone;
    orderForm.address.value = user.address;
}

export const createOrderOverview = (shoppingCart) => {
    const orderSummaryDiv = document.querySelector(".order-summary")

    const orderSummaryTable = document.createElement("table");
    orderSummaryTable.classList.add("order-summary-table");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const orderSummaryHeader = document.createElement("th");
    orderSummaryHeader.textContent = "Order Summary";

    orderSummaryDiv.appendChild(orderSummaryTable);
    orderSummaryTable.appendChild(thead);
    thead.appendChild(headerRow);
    headerRow.appendChild(orderSummaryHeader);

    const tbody = document.createElement("tbody");
    shoppingCart.forEach(item => {
        const tr = document.createElement("tr");

        const tdName = document.createElement("td");
        tdName.textContent = "Name: " + item.name;
        tr.appendChild(tdName);

        const tdQuantity = document.createElement("td");
        tdQuantity.textContent = "Quantity; " + item.quantity;
        tr.appendChild(tdQuantity);

        const tdPrice = document.createElement("td");
        tdPrice.textContent = "Price: " + item.price;
        tr.appendChild(tdPrice);

        tbody.appendChild(tr);
    });
    if (shoppingCart.length > 0) {
        const totalPriceValue = shoppingCart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0)
        const totalPriceRow = document.createElement("tr");
        totalPriceRow.classList.add("order-summary-total-price");

        const totalPriceCell = document.createElement("td");
        totalPriceCell.textContent = "Total price: " + totalPriceValue + "\u20AC";

        totalPriceRow.appendChild(totalPriceCell);
        tbody.appendChild(totalPriceRow);
        orderSummaryTable.appendChild(tbody);

        const orderButton = document.createElement("button");
        orderButton.textContent = "Order";
        orderButton.addEventListener("click", async () => {
            const address = orderForm.address.value;
            let items = [];
            for (let i = 0; i < shoppingCart.length; i++) {
                for (let j = 0; j < shoppingCart[i].quantity; j++) {
                    items.push({product_id: shoppingCart[i].id});
                }
            }
            const success = await postOrder(user, address, items, totalPriceValue);
            handleOrder(success);
        });
        orderSummaryDiv.appendChild(orderButton);
    } else {
        const emptyCart = document.createElement("p");
        emptyCart.textContent = "Your cart is empty";
        orderSummaryDiv.appendChild(emptyCart);
    }
}

const handleOrder = (success) => {
    if (success) {
        modal.style.display = "flex";
        document.getElementById("order-completed").style.display = "block";
        document.querySelector(".order-completed").style.display = "block";
        setTimeout(() => {
            sessionStorage.removeItem("shoppingCart");
            window.location.href = "index.html";
        }, 3000)
    } else {
        modal.style.display = "flex";
        document.getElementById("order-not-completed").style.display = "block";
        document.querySelector(".order-not-completed").style.display = "block";
        setTimeout(() => {
            modal.style.display = "none";
        }, 3000)
    }
}

if (!sessionStorage.getItem("token")) {
    window.location.href = "../index.html";
} else {
    user = JSON.parse(sessionStorage.getItem('user'));
    shoppingCart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    createUserData(user);
    createOrderOverview(shoppingCart)
}
