const reviewModel = require("../models/reviewsModel");

exports.getAllReviews = async (req, res, next)=>{
    const reviews = await reviewModel.find();

    res.status(200).json({
        status: "Success",
        data: {
            reviews
        }
    })
};

exports.createReview = async (req, res, next)=>{
    const review = await reviewModel.create(req.body);

    res.status(200).json({
        status: "Success",
        data: {
            review
        }
    })
}