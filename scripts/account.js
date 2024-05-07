'use strict';
import {getOrderItemsByOrderId, getOrdersByCustomerId} from "./api/fetchCalls.js";


const shoppingCart = JSON.parse(sessionStorage.getItem('shoppingCart'));
console.log(shoppingCart);

const createUserData = (user) => {
    editForm.firstName.placeholder = user.first_name;
    editForm.lastName.placeholder = user.last_name;
    editForm.email.placeholder = user.email;
    editForm.phone.placeholder = user.phone;
    editForm.address.placeholder = user.address;
    editForm.password.placeholder = "********";
    editForm.confirmPassword.placeholder = "********";
}

const editForm = document.querySelector('.edit-form');
let user

if (!sessionStorage.getItem("token")) {
    window.location.href = 'index.html';
} else {
    user = JSON.parse(sessionStorage.getItem('user'));
    createUserData(user);
}

const saveButton = document.querySelector('#save-button');

saveButton.addEventListener('click', async (e) => {
    e.preventDefault()
    //TODO handle form validation
})

const customerOrders = await getOrdersByCustomerId(user.id);
console.log('customer orders', customerOrders);
let orderDateAndStatus = {};
customerOrders.forEach(order => {
    orderDateAndStatus[order.order.order_id] = {date: order.order.order_date, status: order.order.status};
});

const orderIds = customerOrders.map(order => order.order.order_id);
console.log('order ids', orderIds);

const orderHistory = document.createElement('div');
orderHistory.classList.add('order-history');

let ordersWithProducts = {};

for (let orderId of orderIds) {
    let orderProducts = {};
    const orderItems = await getOrderItemsByOrderId(orderId);

    orderItems.forEach(item => {
        if (orderProducts[item.name]) {
            orderProducts[item.name].quantity += 1;
        } else {
            orderProducts[item.name] = { quantity: 1 };
        }
    });

    ordersWithProducts[orderId] = orderProducts;
}

console.log(ordersWithProducts);

const orderHistoryContainer = document.getElementById('account-orders');

const orderHeaderRow = document.createElement('div');
orderHeaderRow.classList.add('order-headers');

const dateHeader = document.createElement('div');
dateHeader.textContent = "DATE";
orderHeaderRow.appendChild(dateHeader);

const statusHeader = document.createElement('div');
statusHeader.textContent = "STATUS";
orderHeaderRow.appendChild(statusHeader);

orderHistory.appendChild(orderHeaderRow);

orderIds.forEach(orderId => {
    const orderRow = document.createElement('div');
    orderRow.classList.add('order-row');

    const orderDateCell = document.createElement('div');
    const date = new Date(orderDateAndStatus[orderId].date);
    const formattedDate = date.toLocaleDateString('fi-FI');
    const formattedTime = date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });
    orderDateCell.textContent = `${formattedDate} ${formattedTime}`;
    orderRow.appendChild(orderDateCell);

    const orderStatusCell = document.createElement('div');
    orderStatusCell.textContent = orderDateAndStatus[orderId].status;
    orderRow.appendChild(orderStatusCell);

    orderHistory.appendChild(orderRow);

    const orderItemsContainer = document.createElement('div');
    orderItemsContainer.classList.add('order-items');

    for (let itemName in ordersWithProducts[orderId]) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('order-item');
        itemDiv.textContent = `${itemName}: ${ordersWithProducts[orderId][itemName].quantity}`;
        orderItemsContainer.appendChild(itemDiv);
    }

    orderHistory.appendChild(orderItemsContainer);

    orderRow.addEventListener('click', () => {
        console.log('Order row clicked');
        if (orderItemsContainer.classList.contains('visible')) {
            console.log('Hiding order items');
            orderItemsContainer.classList.remove('visible');
        } else {
            console.log('Showing order items');
            orderItemsContainer.classList.add('visible');
        }
    });
});

orderHistoryContainer.appendChild(orderHistory);