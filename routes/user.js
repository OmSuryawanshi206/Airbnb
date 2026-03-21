const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

// ================== SIGNUP ==================

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", async (req, res, next) => {
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
});


// ================== LOGIN ==================

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }),
    (req, res) => {

        console.log("RETURN TO URL:", req.session.returnTo);

        req.flash("success", "Welcome back!");

        let redirectUrl = req.session.returnTo;

        // ✅ SAFE fallback
        if (!redirectUrl || redirectUrl.includes("undefined")) {
            redirectUrl = "/listings";
        }

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