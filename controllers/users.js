const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

// ================== SIGNUP ==================
module.exports.signin = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

// ================== LOGIN ==================
module.exports.login1 =  (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {

        console.log("RETURN TO URL:", req.session.returnTo);

        req.flash("success", "Welcome back!");

        let redirectUrl = req.session.returnTo;

        // ✅ SAFE fallback
        if (!redirectUrl || redirectUrl.includes("undefined")) {
            redirectUrl = "/listings";
        }

        delete req.session.returnTo;

        res.redirect(redirectUrl);
    };

    // ================== LOGOUT ==================
    module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    });
};