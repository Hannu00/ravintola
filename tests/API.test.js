import {getProducts, getOrders, postOrder, getUserById, postLogin} from "../scripts/api/fetchCalls";


test("getProducts should return an Array of products", async () => {
    const products = await getProducts();
    expect(Array.isArray(products)).toBeTruthy();
    expect(products.length).toBeGreaterThan(0);
});

test("getOrders should return an Array of orders", async () => {
    const orders = await getOrders();
    expect(Array.isArray(orders)).toBeTruthy();
    expect(orders.length).toBeGreaterThan(0);
});

test("postOrder should return a boolean if the order was successful", async () => {
    const user = {id: 1};
    const address = "Test address";
    const items = [{product_id: 1}, {product_id: 2}, {product_id: 3}];
    const totalPriceValue = 100;
    const boolean = await postOrder(user, address, items, totalPriceValue);
    expect(boolean).toBeTruthy();
});

test("getUserById should return an object with user data", async () => {
    const user = await getUserById(24);
    delete user.password;
    console.log(user);
    const expectedUser = {
        id: 24,
        first_name: "jest",
        last_name: "test",
        email: "jest.test@mail.com",
        phone: "test",
        address: "0",
        role: "user"
    };
    expect(user).toEqual(expectedUser);
});

describe("postLogin for valid and invalid credentials", () => {
    test("postLogin should return an object with a token and user data", async () => {
        const email = "jest.test@mail.com";
        const password = "12345";
        const data = await postLogin(email, password);
        console.log(data)
        expect(data.token).toBeTruthy();
        expect(data.user).toBeTruthy();
    });
    test("postLogin should return an object with an error message", async () => {
        const email = "jest.test@mail.com";
        const password = "wrongpassword";
        const data = await postLogin(email, password);
        expect(data.message).toBe("Incorrect email or password");
    });
});