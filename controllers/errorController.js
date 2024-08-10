const dotenv = require("dotenv");
const AppError = require("../util/appError");

// const handleCastError = error=>{
//     error.message = `Invalid ${error.path}: ${error.value}`;
//     return new AppError(error.message, 400);
// }

// const handleDuplicateValuesDB = error=>{
//     let value = error.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
//     console.log(value)
//     error.message = `Duplicate value x`;
//     return new AppError(error.message, 400);
// }

// const sendProduction = (req, res)=>{
//     return  res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//     })   
// }

// const sendDevelopment = (req, res)=>{
//     return res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//         stack: err.stack,
//     })
// }

// Create a global error handling middleware
// And from now on, any error that's passed through next(), will be passed to this global error middleware handling 
module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || err;
    // let error = {...err};
    // // Send to the client
    // if(process.env.NODE_ENV == "production"){
    //     if(error.name === "CastError"){
    //         error = handleCastError(error)

    //     }
    //     if(error.code === "11000"){
    //         error = handleDuplicateValuesDB(error);
    //     }
    //     sendProduction(error, res);
    // // Send to the Programmer
    // }else if(process.env.NODE_ENV == "development"){
    //     sendDevelopment(error, res);
    // }
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
    
}