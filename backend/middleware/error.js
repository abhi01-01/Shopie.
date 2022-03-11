const ErrorHandler = require("../utils/errorhandler") ;

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500 ;
    err.message = err.message || "Internal Server Error" ;

    // wrong mongodb ID error (CastError)

    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}` ;
        err = new ErrorHandler(message,400) ;
    }

    // Mongoose Duplicate key error while registering

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400) ;
    }

    // JWT Token Error (wrong token)

    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is invalid, try again` ;
        err = new ErrorHandler(message,400) ;
    }

    // JWT expire error

    if(err.name === "TokenExpiredError"){
        const message = `Json web token expired, try again` ;
        err = new ErrorHandler(message,400) ;
    }

    res.status(err.statusCode).json({
        success:false ,
        message:err.message
    });
};