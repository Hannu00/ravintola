import {authenticateAdmin} from "./api/fetchCalls.js";

const currentLanguage = window.location.pathname.includes("/fi/") ? "_fi" : ""

const signupButton = document.getElementById('login-button')
const logOutButton = document.getElementById('logout-button')
const accountButton = document.getElementById('account-button')
const signupButtonMobile = document.getElementById('login-button-mobile')
const logOutButtonMobile = document.getElementById('logout-button-mobile')
const accountButtonMobile = document.getElementById('account-button-mobile')

if (sessionStorage.getItem('token')) {
    signupButton.style.display = 'none'
    logOutButton.style.display = 'block'
    accountButton.style.display = 'block'

    signupButtonMobile.style.display = 'none'
    logOutButtonMobile.style.display = 'block'
    accountButtonMobile.style.display = 'block'

    await accessAdminPanel(sessionStorage.getItem('token'))
}
async function accessAdminPanel(token) {
    const isAdmin = await authenticateAdmin(token);
    const navLinks = document.getElementById('main-nav-links');

    if (isAdmin) {
        const adminLink = document.createElement('li');
        const adminLinkAnchor = document.createElement('a');
        adminLinkAnchor.href = 'admin.html';
        adminLinkAnchor.textContent = 'ADMIN PANEL';

        adminLink.appendChild(adminLinkAnchor);
        navLinks.appendChild(adminLink);
    }
}

logOutButton.addEventListener('click', () => {
    const shoppingCartData = sessionStorage.getItem('shoppingCart');
    sessionStorage.clear();

    if (shoppingCartData) {
        sessionStorage.setItem('shoppingCart', shoppingCartData);
    }

    signupButton.style.display = 'block';
    logOutButton.style.display = 'none';
    accountButton.style.display = 'none';

    signupButtonMobile.style.display = 'block';
    logOutButtonMobile.style.display = 'none';
    accountButtonMobile.style.display = 'none';
});

const hamburgerIcon = document.getElementById('hamburger-icon')
const hamburgerIconSideBar = document.getElementById('hamburger-icon-sidebar')
const sidebar = document.getElementById('side-bar')
hamburgerIcon.addEventListener('click', () => {
    sidebar.classList.toggle('show')
});

hamburgerIconSideBar.addEventListener('click', () => {
    sidebar.classList.toggle('show')

});


export const updateCartDisplay = () => {
    const cartCount = document.getElementById("cart-count");

    if (sessionStorage.getItem('shoppingCart')) {
        const shoppingCart = JSON.parse(sessionStorage.getItem('shoppingCart'))
        cartCount.textContent = shoppingCart.reduce((acc, product) => acc + product.quantity, 0).toString();
    } else {
        cartCount.textContent = 0
    }
}

const shoppingCart = document.getElementById("shoppingCart");
const cartContent = document.getElementById("cartContent");

cartContent.style.display = "none";

shoppingCart.addEventListener("click", function () {
    if (sessionStorage.getItem("shoppingCart") === null || JSON.parse(sessionStorage.getItem("shoppingCart")).length === 0) {
        cartContent.style.display = "none";
    } else {
        cartContent.style.display = cartContent.style.display === "none" ? "block" : "none";
        displayCartContents();
    }
});

const cartProducts = document.getElementById("cartProducts");

export const displayCartContents = () => {
    let totalPrice = 0;
    while (cartProducts.firstChild) {
        cartProducts.removeChild(cartProducts.firstChild);
    }
    const shoppingCart = JSON.parse(sessionStorage.getItem("shoppingCart")) || [];
    shoppingCart.forEach(product => {
        const mainProductContainer = document.createElement("div");
        mainProductContainer.classList.add("cart-product")
        const productContainer = document.createElement("div");
        productContainer.classList.add("cart-product")
        const productButtons = document.createElement("div");
        productButtons.classList.add("cart-buttons")
        const productName = document.createElement("span");
        productName.textContent = product.name;
        productContainer.appendChild(productName);

        let singleProductPrice = Number(product.price) * product.quantity;
        const singleProduct = document.createElement("p");
        singleProduct.classList.add("single-price");
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR'
        });

        let formattedSinglePrice = formatter.format(singleProductPrice);

        let priceOfProduct = Number(product.price);

        totalPrice += priceOfProduct * product.quantity;

        const minusButton = document.createElement("button");
        minusButton.textContent = "-";
        minusButton.addEventListener("click", () => {
            if (product.quantity > 0) {
                product.quantity--;
                sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
            }

            if (product.quantity === 0) {
                const index = shoppingCart.indexOf(product);
                if (index !== -1) {
                    shoppingCart.splice(index, 1);
                }
                productButtons.remove();
                mainProductContainer.remove()
                sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
            }

            productQuantity.textContent = product.quantity;
            sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

            if (shoppingCart.length === 0) {
                cartContent.style.display = "none";
                const checkoutButton = document.querySelector(".proceed-to-checkout-button");
                if (checkoutButton) {
                    checkoutButton.parentElement.remove();
                }
            }
            updateCartDisplay();
            displayCartContents();
        });
        productButtons.appendChild(minusButton);

        const productQuantity = document.createElement("span");
        productQuantity.textContent = product.quantity;
        productButtons.appendChild(productQuantity);

        const plusButton = document.createElement("button");
        plusButton.textContent = "+";

        productButtons.appendChild(plusButton);
        plusButton.addEventListener("click", () => {
            product.quantity++
            productQuantity.textContent = product.quantity;
            sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

            updateCartDisplay();
            displayCartContents();
        });
        singleProduct.textContent = formattedSinglePrice;
        productButtons.appendChild(singleProduct);
        mainProductContainer.appendChild(productContainer);
        mainProductContainer.appendChild(productButtons);
        cartProducts.appendChild(mainProductContainer);

    });

    const detailContainer = document.createElement("div");

    detailContainer.classList.add("total-price");
    const totalInfo = document.createElement("p");
    detailContainer.appendChild(totalInfo);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR'
    });

    let formattedPrice = formatter.format(totalPrice);
    currentLanguage ? totalInfo.textContent = `Yhteensä: ${formattedPrice}` : totalInfo.textContent = `Total: ${formattedPrice}`
    cartProducts.appendChild(detailContainer);

    if (shoppingCart.length > 0) {
        const proceedToCheckoutButton = document.createElement("button");
        currentLanguage ? proceedToCheckoutButton.textContent =  "Siirry tilaamaan" : proceedToCheckoutButton.textContent = "Proceed to checkout";
        proceedToCheckoutButton.classList.add("proceed-to-checkout-button");
        proceedToCheckoutButton.addEventListener("click", () => {
            if (currentLanguage) {
                if (sessionStorage.getItem("token")) {
                    window.location.href = `../fi/checkout_fi.html`;
                } else {
                    sessionStorage.setItem("intendedDestination", `checkout${currentLanguage}.html`);
                    window.location.href = `../fi/login${currentLanguage}.html`;
                }
            } else {
                if (sessionStorage.getItem("token")) {
                    window.location.href = `../en/checkout.html`;
                } else {
                    sessionStorage.setItem("intendedDestination", `checkout.html`);
                    window.location.href = `../en/login.html`;
                }

            }
        });

        const bottomContainer = document.createElement("div");
        bottomContainer.classList.add("proceed-to-checkout-container");
        bottomContainer.appendChild(proceedToCheckoutButton);
        cartProducts.appendChild(bottomContainer);
    }
};

updateCartDisplay()