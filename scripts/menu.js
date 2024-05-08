import {updateCartDisplay} from "./main.js";
import {getProducts} from "./api/fetchCalls.js";

const mergedData = [];
const shoppingCart = [];
if (sessionStorage.getItem("shoppingCart") !== null) {
    shoppingCart.push(...JSON.parse(sessionStorage.getItem("shoppingCart")));
} else {
    sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
}


try {
    const data = await getProducts();
    console.log(data);
    mergeAllergens(data);
    addItems(data);

} catch (error) {
    console.error("Error fetching products:", error.message);
}

function getCategoryList(category) {
    const lowercaseCategory = category.toLowerCase();
    switch (lowercaseCategory) {
        case "pizza":
            return document.getElementById("pizza-list");
        case "salad":
            return document.getElementById("salad-list");
        case "appetizer":
            return document.getElementById("appetizer-list");
        case "kebab":
            return document.getElementById("kebab-list");
        default:
            return null;
    }
}

function mergeAllergens(data) {
    data.forEach(product => {
        const existingProduct = mergedData.find(item => item.id === product.id);
        if (existingProduct) {
            product.allergens.forEach(allergen => {
                if (!existingProduct.allergens.find(existingAllergen => existingAllergen.id === allergen.id)) {
                    existingProduct.allergens.push(allergen);
                }
            });
        } else {
            mergedData.push(product);
        }
    });
}

function addItems(data) {
    const categories = [...new Set(data.map(product => product.category))];



    categories.forEach(category => {
        const cells = ["name", "price", "buy"];
        const headerRow = document.createElement("div");
        headerRow.classList.add("menu-row", "menu-header");
        const headerNames = ["Name",  "Price (€)", "Buy"];
        headerNames.forEach((name, index) => {
            const headerCell = document.createElement("div");
            headerCell.classList.add("menu-cell", cells[index]);
            headerCell.textContent = name;
            headerRow.appendChild(headerCell);
        });

        const categoryList = getCategoryList(category);
        if (categoryList) {
            categoryList.appendChild(headerRow);
        }

        mergedData.filter(product => product.category.toLowerCase() === category.toLowerCase())
            .forEach(product => {
                const menuItem = document.createElement("div");
                menuItem.classList.add("menu-row", "menu-item");

                cells.forEach(key => {
                    if (key === "name") {
                        const cell = document.createElement("div");
                        cell.classList.add("menu-cell", "name");
                        cell.innerHTML = `<span class="product-name">${product.id}. ${product[key]}</span><br><span class="product-description">${product["description"]}, (A/A) ${product.allergens.map(allergen => allergen.name).join(", ")}</span>`;
                        menuItem.appendChild(cell);
                    } else if (key === "price") {
                        const cell = document.createElement("div");
                        cell.classList.add("menu-cell", "price");
                        cell.textContent = product[key];
                        menuItem.appendChild(cell);
                    } else if (key === "buy") {
                        const orderButtonCell = document.createElement("div");
                        orderButtonCell.classList.add("menu-cell", "buy");
                        const orderButton = document.createElement("button");
                        orderButton.classList.add("cart-button");
                        orderButton.innerHTML = "&#x1F6D2;";
                        orderButton.addEventListener("click", function () {
                            const shoppingCart = JSON.parse(sessionStorage.getItem("shoppingCart")) || [];

                            if (!shoppingCart.some(item => item.id === product.id)) {
                                product.quantity = 1;
                                shoppingCart.push(product);
                            } else {
                                shoppingCart.find(item => item.id === product.id).quantity++;
                            }

                            sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
                            updateCartDisplay();
                        });
                        orderButtonCell.appendChild(orderButton);
                        menuItem.appendChild(orderButtonCell);
                    }
                });

                if (categoryList) {
                    categoryList.appendChild(menuItem);
                }
            });
    });
}
