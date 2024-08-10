const mongoose = require("mongoose");
const User = require("./../models/userModel");
const tourSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please provide a valid name!"],
        unique: true,
    },
    rating:{
        type: Number,
        required: [false, "Please provide a valid rating for this product"]
    },
    difficulty:{
        type: String,
        required:[false, "please provide a valid difficulty for this service"]
    },
    duration:{
        type: String,
    },
    groupSize:{
        type: Number,
        required: [false, "Must have a groupSize"]
    },
    ratingsAverage: {
        type: Number
    },
    ratingQuantity:{
        type: Number
    },
    
    price:{
        type: Number,
    },
    summary:{
        type: String,
        trim: true
    },
    description:{
        type: String

    },
    imageCover:{
        type: String,

    },
    images:{
        type: [String],
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    startDates:{
        type: [Date],
        // required: [false, "A tour must have a start date"]
    },
    // The start location here represent a representation for a geographical point but it's not part of any embedding 

    startLocation:{
        type:{
            type: String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
    },
    // Here we embedded the locations entity or table into the tour model or table and usually it's happened by using a [] array 
    locations: [
        {
            type: {
                type: String,
                default: "Point",
                enum: ["Point"]
            },
        
            coordinates: [Number],
            description: String,
            address: String,
            day: Number,
        }

    ],

    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        }
    ],

});

// Creating the model 



// tourSchema.pre("save", function(doc,next){
//     console.log(doc);

// })


const Tour = mongoose.model('Tour', tourSchema);

tourSchema.pre(/^find/, function(next){
    this.populate({
        path: "guides",
        // select: "-__v -passwordChangedAt"
    })
    next()
})

module.exports = Tour;

