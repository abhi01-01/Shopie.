// creating token and saving in cookies
const getCookieOptions = require("./cookieOptions");

const sendToken = (user,statusCode,res)=>{
    const token = user.getJWTToken() ;
    user.password = undefined;

    // options for cookie
    const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 5;
    const options = getCookieOptions(
        new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000)
    );

    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,
        token,
    });
};

module.exports = sendToken ;
