'use strict';
import {getOrderItemsByOrderId, getOrdersByCustomerId, updateUser} from "./api/fetchCalls.js";


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

console.log('user', user);

const accountOrderContainer = document.getElementById('account-orders');

const updateMessageContainer = document.createElement('div');
updateMessageContainer.classList.add('update-message-container');

const updateMessage = document.createElement('p');
updateMessage.classList.add('update-message');
updateMessageContainer.appendChild(updateMessage);

const updateMessageIcon = document.createElement('img');
updateMessageIcon.classList.add('update-message-icon');
updateMessageContainer.appendChild(updateMessageIcon);




saveButton.addEventListener('click', async (e) => {

    e.preventDefault()

    const newUser = {...user}

    if (editForm.firstName.value !== user.first_name) newUser.first_name = editForm.firstName.value;
    if (editForm.lastName.value !== user.last_name) newUser.last_name = editForm.lastName.value;
    if (editForm.email.value !== user.email) newUser.email = editForm.email.value;
    if (editForm.phone.value !== user.phone) newUser.phone = editForm.phone.value;
    if (editForm.address.value !== user.address) newUser.address = editForm.address.value;

    const response = await updateUser(user.id, newUser, sessionStorage.getItem('token'));

    if (!accountOrderContainer.contains(updateMessageContainer)) {
        accountOrderContainer.appendChild(updateMessageContainer);
    }

    if (response.status === 200) {
        sessionStorage.setItem('user', JSON.stringify(newUser));
        updateMessageIcon.id = 'update-completed';
        updateMessage.textContent = 'User information updated successfully!';
        updateMessageIcon.src = '../media/checked.png';
    } else {
        updateMessageIcon.id = 'update-failed';
        updateMessage.textContent = 'Failed to update user information';
        updateMessageIcon.src = '../media/delete.png';
    }

})

const customerOrders = await getOrdersByCustomerId(user.id);
console.log('customer orders', customerOrders);

let orderDateAndStatus = {};
let orderIds;

if (customerOrders) {
    customerOrders.forEach(order => {
        orderDateAndStatus[order.order.order_id] = {date: order.order.order_date, status: order.order.status};
    });
    orderIds = customerOrders.map(order => order.order.order_id);
}


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


if (orderIds.length !== 0) {
    orderIds.forEach(orderId => {
        const orderContainer = document.createElement('div'); // Create a new container for each order
        orderContainer.classList.add('order-container');

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

        orderContainer.appendChild(orderRow);

        const orderItemsContainer = document.createElement('div');
        orderItemsContainer.classList.add('order-items');

        orderContainer.appendChild(orderItemsContainer); // Append the items container to the new container

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

        orderHistoryHeaderContainer.appendChild(orderContainer);
    });
}

orderHistoryContainer.appendChild(orderHistory);
orderHistory.appendChild(orderHistoryHeaderContainer);