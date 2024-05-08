export const getOrders = async () => {
    try {
        const response = await fetch('http://10.120.32.55/app/api/v1/orders');
        const data = await response.json();
        if (response.ok) {
            console.log(data)
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}

export const getProducts = async () => {
    try {
        const response = await fetch('http://10.120.32.55/app/api/v1/products');
        const data = await response.json();
        if (response.ok) {
            console.log(data)
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}

export const getOrdersByCustomerId = async (id) => {
    try {
        const response = await fetch(`http://10.120.32.55/app/api/v1/orders/customer/${id}`);
        const data = await response.json();
        if (response.ok) {
            console.log(data)
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}

export const postOrder = async (user, address, items, totalPriceValue) => {
    try {
        const response = await fetch("http://10.120.32.55/app/api/v1/orders/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "order": {
                    "customer_id": user.id,
                    "delivery_address": address,
                    "status": "processing",
                    "total_price": totalPriceValue
                },
                "products": items
            })
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data)
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export const getOrderItemsByOrderId = async (id) => {
    try {
        const response = await fetch(`http://10.120.32.55/app/api/v1/orders/${id}/items`);
        const data = await response.json();
        if (response.ok) {
            console.log(data)
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}


export async function modifyOrderStatus(id, status) {
    try {
        const response = await fetch(`http://10.120.32.55/app/api/v1/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'status': status})
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data)
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}

export async function updateProduct(id, modifiedProduct, token) {
    console.log(JSON.stringify(modifiedProduct));
    try {
        const response = await fetch(`http://10.120.32.55/app/api/v1/products/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify(modifiedProduct)

        });
        const data = await response.json();
        if (response.ok) {
            console.log(data)
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}

export async function authenticateAdmin(token) {
    try {
        const response = await fetch(`http://10.120.32.55/app/api/v1/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            }
        });
        if (response.ok) {
            return true;
        }
    } catch (error) {
    }
}

export async function createProduct(product, token) {
    try {
        const response = await fetch(`http://10.120.32.55/app/api/v1/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data)
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }

}

export async function deleteProduct(id, token) {
    try {
        const response = await fetch(`http://10.120.32.55/app/api/v1/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
        });
        const data = await response.json();
        if (response.ok) {
            console.log(data)
            return response.status;
        }
    } catch (error) {
        console.log(error);
    }
}

export const getUserById = async (id) => {
    try {
        const response = await fetch(`http://10.120.32.55/app/api/v1/users/${id}`);
        const data = await response.json();
        if (response.ok) {
            console.log(data)
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}

export const getUsers = async () => {
    try {
        const response = await fetch('http://10.120.32.55/app/api/v1/users');
        const data = await response.json();
        if (response.ok) {
            console.log(data)
            // Filter out the password from the user data
            return data.filter(user => user.role === 'user')
                .map(({password, role, ...rest}) => rest);
        }
    } catch (error) {
        console.log(error);
    }
}

export const updateUser = async (id, modifiedUser, token) => {
    try {
        const response = await fetch(`http://10.120.32.55/app/api/v1/users/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify(modifiedUser)
        });
        const data = await response.json();
        return {status: response.status, ...data};
    } catch (error) {
        console.log(error);
    }
}

export const deleteUser = async (id, token) => {
    try {
        const response = await fetch(`http://10.120.32.55/app/api/v1/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
}