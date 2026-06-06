const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhandler");
const stripePackage = require("stripe");

let stripeClient;

const getStripeClient = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new ErrorHandler("Stripe secret key is not configured.", 500);
    }

    if (!stripeClient) {
        stripeClient = stripePackage(process.env.STRIPE_SECRET_KEY);
    }

    return stripeClient;
};

exports.processPayment = catchAsyncErrors(async(req,res,next)=>{
    const paymentIntentPayload = {
        amount:req.body.amount,
        currency:"inr",
        description:req.body.description || "Shopie order payment",
        receipt_email:req.body.customerEmail,
        metadata:{
            customerName:req.body.customerName || "",
            integration:"shopie-web",
        },
    };

    if(req.body.shipping){
        paymentIntentPayload.shipping = req.body.shipping;
    }

    const myPayment = await getStripeClient().paymentIntents.create(paymentIntentPayload);

    res.status(200).json({ success : true , client_secret : myPayment.client_secret}) ;

});

// Sending Api key to frontend

exports.sendStripeApiKey = catchAsyncErrors(async(req,res,next)=>{

    if (!process.env.STRIPE_API_KEY) {
        return next(new ErrorHandler("Stripe publishable key is not configured.", 500));
    }

    res.status(200).json({ stripeApiKey : process.env.STRIPE_API_KEY });

});
