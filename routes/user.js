const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const controllers = require("../controllers/users.js");


router.route("/signup")
.get(controllers.signin)
.post(controllers.signup);


router.route("/login")
.get(controllers.login1)
.post(passport.authenticate("local", {  failureFlash: true,failureRedirect: "/login"}), controllers.login);

router.route("/logout")
.get(controllers.logout);
// ================== SIGNUP ==================
// ================== LOGIN ==================
// ================== LOGOUT ==================

module.exports = router;