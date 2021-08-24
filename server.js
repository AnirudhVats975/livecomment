const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");

app.use(express.static('public'));
require("./db/conn");
const Comment = require("./db/model");

app.use(express.json());


// routing 
app.post("/api/comments", (req,res) =>{
const comment =  new Comment({
    username : req.body.username,
    comment :req.body.comment
})
  
comment.save().then(response =>{
  res.send(response);
})

})

app.get("/api/comments",(req, res) =>{
  Comment.find().then(function(comments){
  res.send(comments)
  })
})





// creating a server 
const server = app.listen(port, ()=>{
    console.log(`express server listen at port No ${port}`);
});


// here we connect to io.Socket.io
const io = require("socket.io")(server);

io.on('connection', (socket)=>{
//  console.log(`new connection : ${socket.id}`);

 //recieve event app.js
  socket.on("comment", (data)=>{
    // add time on data 
    data.time =Date()
    socket.broadcast.emit('comment', data)
  })

  socket.on("typing",(data)=>{
    socket.broadcast.emit('typing', data)
  })
});