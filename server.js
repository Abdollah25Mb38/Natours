const app = require("./app");

const mongoose = require("mongoose");

const db = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD);
mongoose.connect(db).then(con=>{
    console.log("connected Successfully");
});



app.listen(3000, "127.0.0.1", ()=>{
    console.log("Hello from inside the express server!");
})