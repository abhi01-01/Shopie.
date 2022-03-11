const app = require("./app") ;
const cloudinary = require("cloudinary")
const connectDatabase = require("./config/database");

// Handling Uncaught Exceptions

process.on("uncaughtException",(err) => {
    console.log(`Error : ${err.message}`) ;
    console.log("Shutting down the server due to Uncaught Exceptions") ;
    process.exit(1) ;
})

// Config

if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
  }
  

// connecting to database ( do it after config always)

connectDatabase() ;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});


const server = app.listen(process.env.PORT,()=>{

    console.log(`Server is working on http://localhost:${process.env.PORT}`) ;
})


// Unhandled Promise rejection

process.on("unhandledRejection",(err) => {
    console.log(`Error : ${err.message}`) ;
    console.log("Shutting down the server due to unhandled Promise Rejection");

    server.close(()=>{
        process.exit(1) ;
    }) ;
}) ;
