const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");




router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});
router.post("/sign-up", async (req, res) => {


    // find one user with the same name
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
        return res.send("Username already taken.");
    }

    // check if passwords match
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confirm Password must match");
    }
    // hash password
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

    // validation logic

    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}`);


});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {
    //res.send("Request to sign in received!");

    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {

        return res.send("Login failed. Please try again!")
    }
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );
    if(!validPassword) {
        return res.send("Password is incorrect. Please try again!")
    }

// create a sesion 
req.session.user = {
  username: userInDatabase.username,
  _id: userInDatabase._id
};

res.redirect("/");


});

//sign out
router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/")
});


module.exports = router;