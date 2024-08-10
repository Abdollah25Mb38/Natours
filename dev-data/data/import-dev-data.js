const mongoose = require("mongoose");
const Tour = require("./../../models/tourModel");
const fs = require("fs")
const dotenv = require("dotenv");
dotenv.config({path: "./../../config.env"});

const db = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);
console.log(process.env.DATABASE)
mongoose.connect(db).then(con=>{
    console.log("connected Successfully");
});

// Read the data from the file:
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));


// console.log(process.argv)
// insert the data into the database
const import_data = async ()=>{
   try {
    await Tour.create(tours);
   } catch (error) {
    console.log(error)
   }
}

const deleteDatabase = async ()=>{
    try {
        await Tour.deleteMany();
        console.log("Deleted Successfully!");
    } catch (error) {
        console.log(error);
    }
}

if(process.argv[2]==="--delete"){
    deleteDatabase();
    // console.log("The data was successfully deleted from the database!");
}else if(process.argv[2] === "--import"){
    import_data();
    // console.log("The data was successfully imported into the Database!");
}
