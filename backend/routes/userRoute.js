const express = require("express") ;
const {
    registerUser ,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser
} = require("../controllers/userController") ;
const router = express.Router() ;
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth") ;
const createRateLimiter = require("../middleware/rateLimiter");
const {
    validateForgotPassword,
    validateLogin,
    validateRegister,
    validateResetPassword,
    validateUpdatePassword,
    validateUpdateProfile,
} = require("../middleware/validators");

const authRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 30,
    keyPrefix: "auth",
});

const passwordRateLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many password reset attempts. Please try again later.",
    keyPrefix: "password",
});

router.route("/register").post(authRateLimiter, validateRegister, registerUser) ;
router.route("/login").post(authRateLimiter, validateLogin, loginUser);
router.route("/password/forgot").post(passwordRateLimiter, validateForgotPassword, forgotPassword) ;
router.route("/password/reset/:token").put(passwordRateLimiter, validateResetPassword, resetPassword) ;
router.route("/logout").get(logout) ;
router.route("/me").get(isAuthenticatedUser,getUserDetails) ;
router.route("/password/update").put(isAuthenticatedUser,validateUpdatePassword,updatePassword) ;
router.route("/me/update").put(isAuthenticatedUser,validateUpdateProfile,updateProfile) ;
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers) ;
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser).put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser) ;

module.exports = router ;
