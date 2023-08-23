require('dotenv').config(); //must be at the top  //  Security Level 3 \\
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();

//  trying to see if encryption working correctly
// console.log(process.env.SECRET_KEY);  trying to see if encryption working correctly

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Secruity level 2 \\

// var secret = "Iknowyouaretryingtoaccessmysecrets.";
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

// level 3 contiuation \\
userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY, encryptedFields: ['password'] });
/////////////////////////////////////////////// The encryption must be done before specifing mongoose.model \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save() 
  .then(function(registeredUser){
    if (registeredUser) {
      res.render("secrets");
    } else {
      console.log("Not Registered");
    }
  });
});

// Security Level 1 \\

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}).then(function(foundUser) {
    if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      } else {
        res.send("You Are Not The User");
      }
    } else {
      res.send("You Have To Register First");
    }
  });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});