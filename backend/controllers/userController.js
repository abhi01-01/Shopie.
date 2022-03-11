const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors") ;
const User = require("../models/userModel") ;
const sendToken = require("../utils/jwtToken") ;
const sendEmail = require("../utils/sendEmail") ;
const crypto = require("crypto") ;
const cloudinary = require("cloudinary").v2;

// Register a user

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{

    const myCloud = await cloudinary.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale"
    }); 

    const {name,email,password} = req.body;
    
    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:myCloud.public_id,
            url:myCloud.secure_url,
        },
    });
    
    sendToken(user,201,res) ;

});

// login User

exports.loginUser = catchAsyncErrors(async(req,res,next)=>{

    const {email,password} = req.body ;

    // checking if user has given email and password both

    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email and Password",400)) ;
    }

    const user = await User.findOne({email:email}).select("+password") ;

    if(!user){
        return next(new ErrorHandler("Invalid Email or password",401)) ;
    }

    const isPasswordMatched = await user.comparePassword(password) ;

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or password",401)) ;
    }

    sendToken(user,200,res) ;

}) ;

// logout user

exports.logout = catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });


    res.status(200).json({
        success:true,
        message:"Logged Out" ,
    });
});

// Forget password

exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findOne({email:req.body.email}) ;

    if(!user){
        return next(new ErrorHandler("User not found",404)) ;
    }

    // get ResetPasswordToken

    const resetToken =  user.getResetPasswordToken() ;

    await user.save({validateBeforeSave:false}) ;

    //this is for when server is running on the same port
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}` ;
    
    // Since frontend and backend are running on different ports on localhost 
    //const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested this email then , please ignore it.` ;

    try {

        await sendEmail({
            email:user.email,
            subject:`Shopie Password Recovery`,
            message,

        }) ;

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        });
        
    } catch (error) {

        user.resetPasswordToken = undefined ;
        user.resetPasswordExpire = undefined ;

        await user.save({validateBeforeSave:false}) ;

        return next(new ErrorHandler(error.message,500)) ;
    }

});

// Reset password

exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{

    // creating token hash 
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex") ;

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt : Date.now() },
    });

    if(!user){
        return next(new ErrorHandler("Reset password token invalid or expired",400)) ;
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400)) ;
    }

    user.password = req.body.password ;

    user.resetPasswordToken = undefined ;
    user.resetPasswordExpire = undefined ;

    await user.save() ;

    sendToken(user,200,res) ;

});


// Get user Details

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    });
});


// Update user password

exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password") ;

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword) ;

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password, incorrect",400)) ;
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400)) ;
    }

    user.password = req.body.newPassword ;

    await user.save() ;    

    sendToken(user,200,res) ;

});

// Update user profile

exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    };

    // cloudinary here

    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id ;

        await cloudinary.uploader.destroy(imageId) ;

    const myCloud = await cloudinary.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale"
    }); 

    newUserData.avatar = {
        public_id:myCloud.public_id,
        url:myCloud.secure_url,
    };
}

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });
    res.status(200).json({
        success:true,
    });
});

// Get all users (admin)

exports.getAllUsers = catchAsyncErrors(async(req,res,next)=>{

    const users = await User.find() ;

    res.status(200).json({
        success:true,
        users,
    });

});

// Get single users (admin)

exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id) ;

    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`)) ;
    }

    res.status(200).json({
        success:true,
        user,
    });

});

// Update user Role by admin only

exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{

    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    };


    await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    });
});


// Delete user 

exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.params.id);
    
    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`,400)) ;
    }

    const imageId = user.avatar.public_id ;

    await cloudinary.uploader.destroy(imageId) ;
    
    await user.remove() ;

    res.status(200).json({
        success:true,
        message:"User deleted successfully",
    });
});




