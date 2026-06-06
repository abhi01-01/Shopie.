const express = require("express") ;
const app = express() ; 
const errorMiddleware = require("./middleware/error")
const cookieParser = require("cookie-parser") ;
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const requestLogger = require("./middleware/requestLogger");
const securityHeaders = require("./middleware/securityHeaders");

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
  }

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(securityHeaders);
app.use(requestLogger);
app.use(express.json({ limit: "10mb" })) ;
app.use(cookieParser()) ;
app.use(bodyParser.urlencoded({extended:true, limit: "10mb"}));
app.use(fileUpload());     


// Route Imports
const product = require("./routes/productRoute") ;
const user = require("./routes/userRoute") ;
const order = require("./routes/orderRoute") ;
const payment = require("./routes/paymentRoute") ;

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "shopie-api",
    environment: process.env.NODE_ENV || "DEVELOPMENT",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1",product) ;
app.use("/api/v1",user) ;
app.use("/api/v1",order) ;
app.use("/api/v1",payment) ;

// connecting frontend to backend
const frontendBuildPath = path.join(__dirname, "../frontend/build");
const frontendIndexPath = path.join(frontendBuildPath, "index.html");

app.use(express.static(frontendBuildPath));

app.get("*", (req, res) => {
  if (fs.existsSync(frontendIndexPath)) {
    return res.sendFile(frontendIndexPath);
  }

  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      message: "API route not found",
    });
  }

  res.status(503).json({
    success: false,
    message:
      "Frontend build is missing. Run `npm run build` before starting the server, or ensure Render runs the install/build step before `npm start`.",
  });
});


// Middleware for errors

app.use(errorMiddleware) ;

module.exports = app ;
