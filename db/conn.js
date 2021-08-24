const mongoose= require("mongoose");

// DB connection 
const url = "mongodb://localhost/comments";

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const connection  =mongoose.connection;

connection.once("open", ()=>{
    console.log("database connected..")
}).catch((err)=>{
console.log("connection is failed..");
});