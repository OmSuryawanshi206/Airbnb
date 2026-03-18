const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const { returnTo } = require("../middleware.js");


// ================== SIGNUP ==================

// Signup Page
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// Signup Logic
router.post("/signup", returnTo, async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to Wanderlust!");

            const redirectUrl = res.locals.returnTo || "/listings";
            delete req.session.returnTo;

            res.redirect(redirectUrl);
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});


// ================== LOGIN ==================

// Login Page
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Login Logic
router.post("/login",
    returnTo,
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");

        const redirectUrl = res.locals.returnTo || "/listings";
        delete req.session.returnTo;

        res.redirect(redirectUrl);
    }
);


// ================== LOGOUT ==================

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    });
});


module.exports = router;