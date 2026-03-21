const Listing = require("./models/listing");
const Review = require("./models/reviews");   // ✅ ADD THIS
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const mongoose = require("mongoose");

// ---------------- LOGIN CHECK ----------------
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        if (
            req.originalUrl !== "/login" &&
            req.originalUrl !== "/signup"
        ) {
            req.session.returnTo = req.originalUrl;
        }

        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

// ---------------- OWNER AUTH ----------------
const isOwner = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError("Invalid Listing ID", 400));
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        return next(new ExpressError("Listing not found", 404));
    }

    if (!req.user || !listing.owner || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

// ---------------- REVIEW AUTHOR AUTH ----------------
const isReviewAuthor = async (req, res, next) => {
    const { reviewId, id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return next(new ExpressError("Invalid Review ID", 400));
    }

    const review = await Review.findById(reviewId);

    if (!review) {
        return next(new ExpressError("Review not found", 404));
    }

    if (!req.user || !review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission!");
        return res.redirect(`/listings/${id}`);   // ✅ FIXED
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

// ---------------- VALIDATION REVIEW ----------------
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(errMsg, 400));
    }
    next();
};

module.exports = {
    isLoggedIn,
    isOwner,
    isReviewAuthor,
    validateListing,
    validateReview
};