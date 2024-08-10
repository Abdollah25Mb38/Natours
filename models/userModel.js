const mongoose = require("mongoose");
// const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    index: {
        type: Number,
        unique: true, 
        dropDups: true
    },
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true, 
        dropDups: true
    },
    email:{
        type: String,
        required: [true, "Please provide a valid email"],
        unique: true,
    },
    role:{
        type: String,
        enum: ["admin", "guide", "user", "lead-guide"],
        default: "user",
    },
    password:{
        type: String,
        required: [true, "Please provide a valid password"],
        unique: true,
        // select: false,
    },
    passwordConfirm:{
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function(el){
                return el === this.password              
            },
            message: "passwords are not the same"
        }
    },
    changedAt: {
        type: Date,
        default: Date.now(),
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
});

userSchema.pre("save", async function(next){
    // Make sure that hashing occur only when the password is changed
    if(!this.isModified("password")) return next();

    // Hash the password
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
})

userSchema.methods.correctPassword = async(candidate, existingPassword)=>{
    return await bcrypt.compare(candidate, existingPassword); 
}

// Verify when was the token issued: property changedAt
userSchema.methods.changedAfter = function(JWTTimestamp){
    // console.log(JWTTimestamp,this.changedAt);
    // console.log(parseInt(this.changedAt.getTime()/1000, 10))

    if(this.changedAt){
        const changedTimestamp = parseInt(this.changedAt.getTime()/1000, 10);
        return JWTTimestamp < changedTimestamp;
    }

    return false;
}

userSchema.methods.createTempPassword = function(){
    const resetPass = crypto.randomBytes(25).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetPass).digest("hex");
    this.passwordResetExpires = Date.now() +10*60*1000;
    return resetPass;
}

const User = new mongoose.model('User', userSchema);

module.exports = User;