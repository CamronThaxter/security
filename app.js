//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true
    },
    password: {
        type: String,
        required:true
    }
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname));

app.get("/", function(req, res) {
    res.render("home", {

    });
});

app.get("/login", function(req, res) {
    res.render("login", {

    });
});

app.get("/register", function(req, res) {
    res.render("register", {

    });
});

app.post("/register", function(req, res) {
    // const username = req.body.email;
    // const password = req.body.password;

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err) {
        if (err) {
            console.log(err);
        }
        
        else {
            res.render("secrets");
        }
    })
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, found) {
        if (err) {
            console.log(err);
        }

        if (found) {
            if (found.password === password) {
                res.render("secrets");
            }
        }
    });
});

// app.get("/secrets", function(req, res) {
//     res.render("secrets", {

//     });
// });

// app.get("/submit", function(req, res) {
//     res.render("submit", {

//     });
// });


app.listen(3000, function(){
    console.log("Server started on port 3000");
});