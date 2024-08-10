const AppError = require("../util/appError");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const sendEmail = require("./../util/email");

exports.signup = async (req, res)=>{
    const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    const token = jwt.sign({id:user.id}, process.env.JWT_SECRET_CODE, {
        expiresIn: process.env.EXPIRES_IN,
    });

    res.status(201).json({
        status: "Succcess",
        data:{
            user,
            token
        }
    })
}

exports.login = async (req, res)=>{
    const {email, password} = req.body;
    console.log(email, password);

    // Check if the email and password are given by the user
    if(!email||!password){
        return new AppError("Please provide email and password", 400);
    }

    // Check if the user is available in the database
    const user = await User.findOne({email:email}).select("+password");

    // Compare the submitted password with the existing hashed password in the database:
    const correct = user.correctPassword(password, user.password);

    if(!user|| !correct){
        return new AppError("email or password is not correct", 500);
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_CODE, {
        expiresIn: process.env.EXPIRES_IN,
    })

    res.status(200).json({
        status: "Loged in",
        data:{
            user,
            token
        }
    })
}

// Accessing protected Rotes:
exports.protect = async (req, res, next)=>{
    // Getting the JWT from the headers:
    let token;
    // Get the jwt token
    if(req.headers.authorization){
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token){
        return next(new AppError("You are not logged in, please log in!"));
    }

    // Find the user that relates to the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_CODE);

    // Find the user that relates to the token, or the _id:
    const user = await User.findOne({_id: decoded.id});
    console.log(user);
    
    if(!user){
        return next(new AppError("There is no such user."))
    }

    // Verify if the token is valid
    if(user.changedAfter(decoded.iat)){
        return next(new AppError("The password were changed, please try logging in again."))
    }

    // Verify if the token was not issued after the password was changed

    
    req.user = user;
    next();
}

exports.restrictTo = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError("You do not have the permission to perform this action", 400));
        }
    next()
    }
}

exports.forgotPassword = async (req, res, next)=>{
    // We should receive an email from the user
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new AppError("There is no such email or user, please try another email.", 400));
    }

    // Sending a temporary password/token to the email
    const tempPass = user.createTempPassword()
    await user.save({validateBeforeSave: false});
    
    // Sending an email to the user with the temperory Password
    try {
        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${tempPass}`;
        const message = `forgot your password? Submit a patch request with your new password and passwordConfirm to ${resetUrl}\nIf you did not forget your password, please ignore this message`;

        await sendEmail({
            email: user.email,
            subject: "Your password reset token is valid for 10 minutes",
            message,
        })

        res.json({
        status: "Success",
        message: "email was sent to the user"
    })
    } catch (error) {
        console.log(error);
    }


}

// exports.resetPassword = (req, res, next)=>{}