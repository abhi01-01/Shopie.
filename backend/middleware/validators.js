const validator = require("validator");
const ErrorHandler = require("../utils/errorhandler");

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const VALID_ORDER_STATUSES = ["Processing", "Shipped", "Delivered"];

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isValidEmail = (value) => typeof value === "string" && validator.isEmail(value);
const isValidObjectId = (value) => typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);

const toNumber = (value) => {
    if (value === "" || value === null || value === undefined) {
        return NaN;
    }

    return Number(value);
};

const isPositiveNumber = (value) => {
    const number = toNumber(value);
    return Number.isFinite(number) && number > 0;
};

const isNonNegativeNumber = (value) => {
    const number = toNumber(value);
    return Number.isFinite(number) && number >= 0;
};

const getImages = (images) => {
    if (Array.isArray(images)) {
        return images;
    }

    if (typeof images === "string") {
        return [images];
    }

    return [];
};

const getDataUriSizeInBytes = (value = "") => {
    const payload = value.split(",")[1] || "";
    return Buffer.byteLength(payload, "base64");
};

const isValidImageDataUri = (value) =>
    typeof value === "string" &&
    /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value) &&
    value.split(",")[1]?.trim();

const validateImageList = (images, { required = false } = {}) => {
    const imageList = getImages(images);

    if (required && imageList.length === 0) {
        throw new ErrorHandler("At least one product image is required.", 400);
    }

    imageList.forEach((image) => {
        if (!isValidImageDataUri(image)) {
            throw new ErrorHandler("Product images must be valid base64 image data URLs.", 400);
        }

        if (getDataUriSizeInBytes(image) > MAX_IMAGE_SIZE_BYTES) {
            throw new ErrorHandler("Each product image must be 5 MB or smaller.", 400);
        }
    });
};

const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!isNonEmptyString(name)) {
        return next(new ErrorHandler("Name is required.", 400));
    }

    if (!isValidEmail(email)) {
        return next(new ErrorHandler("A valid email is required.", 400));
    }

    if (!isNonEmptyString(password) || password.length < 8) {
        return next(new ErrorHandler("Password must be at least 8 characters.", 400));
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !isNonEmptyString(password)) {
        return next(new ErrorHandler("Please enter a valid email and password.", 400));
    }

    next();
};

const validateForgotPassword = (req, res, next) => {
    if (!isValidEmail(req.body.email)) {
        return next(new ErrorHandler("A valid email is required.", 400));
    }

    next();
};

const validateResetPassword = (req, res, next) => {
    const { password, confirmPassword } = req.body;

    if (!isNonEmptyString(password) || password.length < 8) {
        return next(new ErrorHandler("Password must be at least 8 characters.", 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password does not match.", 400));
    }

    next();
};

const validateUpdatePassword = (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!isNonEmptyString(oldPassword)) {
        return next(new ErrorHandler("Old password is required.", 400));
    }

    if (!isNonEmptyString(newPassword) || newPassword.length < 8) {
        return next(new ErrorHandler("New password must be at least 8 characters.", 400));
    }

    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("Password does not match.", 400));
    }

    next();
};

const validateUpdateProfile = (req, res, next) => {
    const { name, email, avatar } = req.body;

    if (name !== undefined && !isNonEmptyString(name)) {
        return next(new ErrorHandler("Name cannot be empty.", 400));
    }

    if (email !== undefined && !isValidEmail(email)) {
        return next(new ErrorHandler("A valid email is required.", 400));
    }

    if (avatar !== undefined && typeof avatar !== "string") {
        return next(new ErrorHandler("Avatar must be a string URL or data URL.", 400));
    }

    next();
};

const validateProductCreate = (req, res, next) => {
    const { name, description, price, category, Stock, images } = req.body;

    if (!isNonEmptyString(name)) {
        return next(new ErrorHandler("Product name is required.", 400));
    }

    if (!isNonEmptyString(description)) {
        return next(new ErrorHandler("Product description is required.", 400));
    }

    if (!isNonEmptyString(category)) {
        return next(new ErrorHandler("Product category is required.", 400));
    }

    if (!isPositiveNumber(price)) {
        return next(new ErrorHandler("Product price must be greater than 0.", 400));
    }

    if (!isNonNegativeNumber(Stock)) {
        return next(new ErrorHandler("Product stock cannot be negative.", 400));
    }

    validateImageList(images, { required: true });
    next();
};

const validateProductUpdate = (req, res, next) => {
    const { name, description, price, category, Stock, images } = req.body;

    if (name !== undefined && !isNonEmptyString(name)) {
        return next(new ErrorHandler("Product name cannot be empty.", 400));
    }

    if (description !== undefined && !isNonEmptyString(description)) {
        return next(new ErrorHandler("Product description cannot be empty.", 400));
    }

    if (category !== undefined && !isNonEmptyString(category)) {
        return next(new ErrorHandler("Product category cannot be empty.", 400));
    }

    if (price !== undefined && !isPositiveNumber(price)) {
        return next(new ErrorHandler("Product price must be greater than 0.", 400));
    }

    if (Stock !== undefined && !isNonNegativeNumber(Stock)) {
        return next(new ErrorHandler("Product stock cannot be negative.", 400));
    }

    if (images !== undefined && getImages(images).length > 0) {
        validateImageList(images);
    }

    next();
};

const validateReview = (req, res, next) => {
    const rating = toNumber(req.body.rating);

    if (!isValidObjectId(req.body.productId)) {
        return next(new ErrorHandler("Valid productId is required.", 400));
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        return next(new ErrorHandler("Rating must be between 1 and 5.", 400));
    }

    if (!isNonEmptyString(req.body.comment)) {
        return next(new ErrorHandler("Review comment is required.", 400));
    }

    next();
};

const validateOrderCreate = (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, totalPrice } = req.body;

    if (!shippingInfo || typeof shippingInfo !== "object") {
        return next(new ErrorHandler("Shipping information is required.", 400));
    }

    if (!isNonEmptyString(shippingInfo.address) || !isNonEmptyString(shippingInfo.city) || !isNonEmptyString(shippingInfo.state)) {
        return next(new ErrorHandler("Shipping address, city, and state are required.", 400));
    }

    if (!isPositiveNumber(shippingInfo.pinCode) || !isPositiveNumber(shippingInfo.phoneNo)) {
        return next(new ErrorHandler("Valid shipping pin code and phone number are required.", 400));
    }

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
        return next(new ErrorHandler("At least one order item is required.", 400));
    }

    if (!paymentInfo || !isNonEmptyString(paymentInfo.id) || !isNonEmptyString(paymentInfo.status)) {
        return next(new ErrorHandler("Payment information is required.", 400));
    }

    if (!isPositiveNumber(totalPrice)) {
        return next(new ErrorHandler("Total price must be greater than 0.", 400));
    }

    next();
};

const validateOrderStatus = (req, res, next) => {
    if (!VALID_ORDER_STATUSES.includes(req.body.status)) {
        return next(new ErrorHandler(`Order status must be one of: ${VALID_ORDER_STATUSES.join(", ")}.`, 400));
    }

    next();
};

const validatePayment = (req, res, next) => {
    const amount = toNumber(req.body.amount);

    if (!Number.isInteger(amount) || amount <= 0) {
        return next(new ErrorHandler("Payment amount must be a positive integer in the smallest currency unit.", 400));
    }

    if (req.body.customerEmail !== undefined && !isValidEmail(req.body.customerEmail)) {
        return next(new ErrorHandler("A valid customer email is required.", 400));
    }

    next();
};

module.exports = {
    validateForgotPassword,
    validateLogin,
    validateOrderCreate,
    validateOrderStatus,
    validatePayment,
    validateProductCreate,
    validateProductUpdate,
    validateRegister,
    validateResetPassword,
    validateReview,
    validateUpdatePassword,
    validateUpdateProfile,
};
