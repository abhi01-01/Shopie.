const express = require("express") ;
const { newOrder,
     getSingleOrder,
     myOrders,
     getAllOrders,
     updateOrder,
     deleteOrder
     } = require("../controllers/orderController");
     
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth") ;
const {
     validateOrderCreate,
     validateOrderStatus,
     } = require("../middleware/validators");
const router = express.Router() ;

router.route("/order/new").post(isAuthenticatedUser,validateOrderCreate,newOrder) ;

router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder) ;

router.route("/orders/me").get(isAuthenticatedUser,myOrders) ;

router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders) ;

router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRoles("admin"),validateOrderStatus,updateOrder).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder) ;



module.exports = router ;
