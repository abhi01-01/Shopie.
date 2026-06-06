const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const appSource = fs.readFileSync(path.join(root, "frontend/src/App.js"), "utf8");

const expectedRoutes = [
    { route: "/", component: "Home", file: "frontend/src/component/Home/Home.js" },
    { route: "/products", component: "Products", file: "frontend/src/component/Product/Products.js" },
    { route: "/product/:id", component: "ProductDetails", file: "frontend/src/component/Product/ProductDetails.js" },
    { route: "/account", component: "Profile", file: "frontend/src/component/User/Profile.js" },
    { route: "/shipping", component: "Shipping", file: "frontend/src/component/Cart/Shipping.js" },
    { route: "/process/payment", component: "Payment", file: "frontend/src/component/Cart/Payment.js" },
    { route: "/admin/dashboard", component: "Dashboard", file: "frontend/src/component/admin/Dashboard.js" },
];

expectedRoutes.forEach(({ route, component, file }) => {
    assert(
        appSource.includes(`path="${route}"`) || appSource.includes(`path='${route}'`),
        `Expected App.js to declare route ${route}`
    );

    assert(
        appSource.includes(`component={${component}}`),
        `Expected App.js route ${route} to use ${component}`
    );

    assert(fs.existsSync(path.join(root, file)), `Expected route component file to exist: ${file}`);
});

assert(appSource.includes("ProtectedRoute"), "Expected protected routes to be wired through ProtectedRoute");
