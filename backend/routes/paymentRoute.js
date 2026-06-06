const express = require("express");
const { processPayment, sendStripeApiKey } = require("../controllers/paymentController");
const router = express.Router() ;
const { isAuthenticatedUser } = require("../middleware/auth");
const createRateLimiter = require("../middleware/rateLimiter");
const { validatePayment } = require("../middleware/validators");

const paymentRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 40,
    keyPrefix: "payment",
});

router.route("/payment/process").post( isAuthenticatedUser , paymentRateLimiter, validatePayment, processPayment );

router.route("/stripeapikey").get( isAuthenticatedUser , sendStripeApiKey );


module.exports = router ;
