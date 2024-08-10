const express = require("express")
const app = express();
app.use(express.json());
const errorControl = require("./controllers/errorController");
const AppError = require("./util/appError");
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});
const tourRouter = require("./routes/tourRouter")
const userRouter = require("./routes/userRouter");
const reviewRouter = require("./routes/reviewRoute");

const morgan = require("morgan");
// app.use(morgan());
app.use(express.json());
// app.use(express.static(`${}`))
// tourRouter.route("/:id").patch(editTour).delete(deleteTour);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next)=>{
    
    // res.status(404).json({
    //     status: "failed",
    //     error: `there is no ${req.originalUrl} for this API`,
    // })
    next(new AppError("there is no such URL", 400));
})

// Global Error Handler middleware
app.use(errorControl)

module.exports = app;