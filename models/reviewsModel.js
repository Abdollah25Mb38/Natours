const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please, write down your review"]
    },
    rating:{
        type: Number,
        min: 1,
        max: 5
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    tour:{
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, "A review must belong to a tour"]
    },

    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, "A review must be written by a user"]
    }

});

const reviewModel = mongoose.model("reviewModel", reviewSchema);

module.exports = reviewModel;