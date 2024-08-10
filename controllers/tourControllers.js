const fs = require("fs");
const express = require("express")
const Tour = require("./../models/tourModel");
const AppError = require("../util/appError");

exports.getTop5 = (req, res, next)=>{
    req.query.sort = "-price,ratingsAverage";
    req.query.limit = 5;
    next();
}

class APIFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr
    }
    filter(){
        const queryObj = {...this.queryStr};
        
        // Now we need to exclude the fields that won't be used by the filteration, as follows:
        const excludedFields = ['fields', 'sort', 'limit', 'page'];
        excludedFields.forEach(el=> delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        // console.log(queryStr)
       
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match=>`$${match}`);
        queryStr = JSON.parse(queryStr)
        this.query.find(queryStr);
        return this;
    }

    sort(){
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(",").join(" ");
            console.log(sortBy)
            this.query = this.query.sort(sortBy);
        }else{
            this.query.sort("price");
        }
        return this;
    }

    fields(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        }
        return this;
    }

    paginate(){
        const page = this.queryStr.page*1||1;
        const limit = this.queryStr.limit*1 || 100;
        const skip = (page-1)*limit;
        console.log(this.queryStr.page, this.queryStr.limit, skip)
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

const catchAsync = fn=>{
    return (req, res, next)=>{
        fn(req, res, next).catch(error=>next(error));
    }
}

exports.getAllTours = catchAsync(async (req, res, next)=>{
    // Build the query
    // const queryObj = {...req.query};
    
    // // Now we need to exclude the fields that won't be used by the filteration, as follows:
    // const excludedFields = ['fields', 'sort', 'limit', 'page'];
    // excludedFields.forEach(el=> delete queryObj[el]);

    // let queryStr = JSON.stringify(queryObj);
    // console.log(queryStr)
   
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match=>`$${match}`);
    // queryStr = JSON.parse(queryStr)
    // let query = Tour.find(queryStr);
    const features = new APIFeatures(Tour.find(), req.query).filter().sort().fields().paginate();
    let tours = await features.query;
    
    // Applying sort feature
    // if(req.query.sort){
    //     const sortBy = req.query.sort.split(",").join(" ");
    //     console.log(sortBy)
    //     query = query.sort(sortBy);
    // }else{
    //     query.sort(price);
    // }

    // Implementing fields limiting (i.e, selecting specific fields from the documents);
    // if(req.query.fields){
    //     const fields = req.query.fields.split(",").join(" ");
    //     query = query.select(fields);
    // }

    // Implementing Pagination
    // const page = req.query.page*1||1;
    // const limit = req.query.limit*1 || 100;
    // const skip = (page-1)*limit;
    // console.log(req.query.page, req.query.limit, skip)
    // query = query.skip(skip).limit(limit);

    // const tours = await query;
    res.status(200).json({
    status: "Success",
    result: tours.length,
    data:{
        tours: tours
    }
})

})

exports.findSingleTour = async (req, res, next)=>{
    try {
        const tour = await Tour.findById(req.params.id);
        if(!tour){
            return next(new AppError("there is no such tour", 404));
        }
        res.status(200).json({
            status: "Success",
            tour:{
                tour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            tour:{
                tour: null
            }
        })
    }
}

exports.createTour = async (req, res)=>{
    // console.log(req.body)

    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
        status: "Success",
        tour:{
            newTour
        }
    })
    } catch (error) {
        console.log(error)
        res.status(400).json({
        status:"Failed",
        error: error,
        data: null
      })  
    }
}

exports.editTour = async (req, res)=>{
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(201).json({
            status: "Success",
            data:{
                updatedTour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            data: null
        })
    }

}

exports.deleteTour = async (req, res)=>{
    try {
        await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "deleted",
        data: null
    })
    } catch (error) {
      res.status(400).json({
        status: "failed",
      })  
    }
}

exports.getStats = async (req, res)=>{
    try {
        const stats = await Tour.aggregate([
            {$match:{ratingsAverage:{$gte:4.8}}},
            {
                $group:{
                    _id: "ratingsAverage",
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'},
                }
            }
        ])
    
        res.status(200).json({
            status:"Success",
            data:stats
        })
    } catch (error) {
        res.status(400).json({
            status:"failed",
            data: null,
            error: error
        })
    }
}

