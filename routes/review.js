const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");


// ----------------- CREATE REVIEW -----------------
router.post(
  "/",
  isLoggedIn,          // ✅ FIXED ORDER
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError("Listing Not Found", 404);
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
  })
);


// ----------------- DELETE REVIEW -----------------
router.delete(
  "/:reviewId",
  isReviewAuthor,
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    // Delete review
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;