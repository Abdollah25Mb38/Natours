const express = require("express");
const {getAllTours, createTour, deleteTour, editTour, findSingleTour, getTop5, getStats} = require("./../controllers/tourControllers");
const {protect, restrictTo} = require("./../controllers/authController");
const tourRouter = express.Router();

tourRouter.route("/getStats").get(getStats);
tourRouter.route("/top5Cheap").get(getTop5);
tourRouter.route("/").get(protect, getAllTours).post(createTour);
tourRouter.route("/:id").get(findSingleTour).patch(editTour).delete(protect,restrictTo("admin", "user"),deleteTour);
module.exports = tourRouter;