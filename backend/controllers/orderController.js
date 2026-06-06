const Order =  require("../models/orderModels") ;
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors")

// Creating new order

exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body ;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });

    res.status(201).json({
        succes:true,
        order,
    });
});

// get Single Order

exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if(!order){
        return next(new ErrorHandler("Order not found with this id",404)) ;
    }

    res.status(200).json({
        success:true,
        order,
    });
});

// get logged in user orders

exports.myOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find({user:req.user._id}) ;

    res.status(200).json({
        success:true,
        orders,
    });
});

// get all orders -- Admin

exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find() ;

    let totalAmount = 0 ;

    orders.forEach((order)=>{
        totalAmount += order.totalPrice ;
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    });
});

// update order status

exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id) ;

    if(!order){
        return next(new ErrorHandler("Order not found with this id",404)) ;
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You have already delivered this order",400)) ;
    }

    const nextStatus = req.body.status;

    if(order.orderStatus === nextStatus){
        return res.status(200).json({
            success:true,
        });
    }

    const allowedTransitions = {
        Processing:["Shipped","Delivered"],
        Shipped:["Delivered"],
    };

    if(!allowedTransitions[order.orderStatus]?.includes(nextStatus)){
        return next(new ErrorHandler(`Cannot update order from ${order.orderStatus} to ${nextStatus}`,400)) ;
    }

    const shouldDecrementStock =
        order.orderStatus === "Processing" &&
        (nextStatus === "Shipped" || nextStatus === "Delivered");

    if (shouldDecrementStock) {
        for (const item of order.orderItems) {
            await updateStock(item.product, item.quantity);
        }
    }

    order.orderStatus = nextStatus;

    if(nextStatus === "Delivered"){
        const deliveredAt = Date.now();
        order.deliveredAt = deliveredAt;
        order.dileveredAt = deliveredAt;
    }

    await order.save({validateBeforeSave:false}) ;

    res.status(200).json({
        success:true,
    });

});

// Update Stock (Admin)

async function updateStock(id,quantity) {

    const product = await Product.findById(id) ;

    if(!product){
        throw new ErrorHandler(`Product not found while updating stock: ${id}`,400) ;
    }

    if(product.Stock < quantity){
        throw new ErrorHandler(`Insufficient stock for product: ${product.name}`,400) ;
    }

    product.Stock -= quantity ;

    await product.save({validateBeforeSave:false}) ;
};

// delete order -- Admin

exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id) ;

    if(!order){
        return next(new ErrorHandler("Order not found with this id",404)) ;
    }

    await order.remove() ;

    res.status(200).json({
        success:true,
    });
});
