const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema");
const mongoose = require("mongoose");
const { reviewSchema } = require("./schema");

// ---------------- LOGIN CHECK ----------------
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

// ---------------- RETURN TO ----------------
const returnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

// ---------------- OWNER AUTH ----------------
const isOwner = async (req, res, next) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        return next(new ExpressError("Listing not found", 404));
    }

    if (!listing.owner || listing.owner.toString() !== req.user._id.toString()) {
        req.flash("error", "You don't have permission!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// ---------------- VALIDATION ----------------
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(errMsg, 400));
    }
    next();
};

// ----------------- VALIDATION REVIEW-----------------
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(errMsg, 400);
  }
  next();
};


module.exports = {
    isLoggedIn,
    returnTo,
    isOwner,
    validateListing,
    validateReview
};