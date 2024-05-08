'use strict';
import {getOrderItemsByOrderId, getOrdersByCustomerId} from "./api/fetchCalls.js";


const shoppingCart = JSON.parse(sessionStorage.getItem('shoppingCart'));
console.log(shoppingCart);

const createUserData = (user) => {
    editForm.firstName.value = user.first_name;
    editForm.lastName.value = user.last_name;
    editForm.email.value = user.email;
    editForm.phone.value = user.phone;
    editForm.address.value = user.address;
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

const orderHistoryContainer = document.getElementById('account-orders');

const orderHistory = document.createElement('div');
orderHistory.classList.add('order-history');

const orderHistoryHeaderContainer = document.createElement('div');
orderHistoryHeaderContainer.classList.add('order-history-headers');

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

    orderHistoryHeaderContainer.appendChild(orderRow);

    const orderItemsContainer = document.createElement('div');
    orderItemsContainer.classList.add('order-items');


    orderHistoryHeaderContainer.appendChild(orderItemsContainer);

    orderRow.addEventListener('click', async () => {
        console.log('Order row clicked');
        if (orderItemsContainer.classList.contains('visible')) {
            console.log('Hiding order items');
            orderItemsContainer.classList.remove('visible');
        } else {
            console.log('Showing order items');
            orderItemsContainer.classList.add('visible');

            orderItemsContainer.innerHTML = '';

            const orderItems = await getOrderItemsByOrderId(orderId);

            const itemCounts = orderItems.reduce((counts, item) => {
                counts[item.name] = (counts[item.name] || 0) + 1;
                return counts;
            }, {});

            for (const [itemName, quantity] of Object.entries(itemCounts)) {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('order-item');
                itemDiv.textContent = `${itemName}: ${quantity}`;
                orderItemsContainer.appendChild(itemDiv);
            }
        }
    });
});

orderHistoryContainer.appendChild(orderHistory);
orderHistory.appendChild(orderHistoryHeaderContainer);