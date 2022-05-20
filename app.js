const express = require("express");
const bodyParser = require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema={
  email:String,
  username:String,
  password:String,
  confirm:String,
  Date:String
}

const User= new mongoose.model("User",userSchema);


app.get("/signup",function(req,res){
  res.render("signup");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/",function(req,res){
  res.render("home");
});

app.post("/signup",function(req,res){
  const newuser=new User({
    email:req.body.EmailID,
    username:req.body.username,
    password:req.body.password,
    confirm:req.body.confirm,
    Date:req.body.DOB
  });
    if(req.body.password === req.body.confirm){
  newuser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("login");
    }
  });
}else{
    
}
});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
