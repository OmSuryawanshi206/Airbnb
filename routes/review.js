const express = require("express");
const router = express.Router({ mergeParams: true });
const controllers = require("../controllers/reviews.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");

router.route("/")
.post(isLoggedIn, validateReview, wrapAsync(controllers.createReview));

router.route("/:reviewId")
.delete(isReviewAuthor, isLoggedIn, controllers.deleteReview);


// ----------------- CREATE REVIEW -----------------
// ----------------- DELETE REVIEW -----------------

module.exports = router;