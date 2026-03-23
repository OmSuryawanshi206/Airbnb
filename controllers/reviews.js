const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
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
  };

module.exports.deleteReview = async (req, res) => {
        const { id, reviewId } = req.params;
    
        // Remove review reference from listing
        await Listing.findByIdAndUpdate(id, {
          $pull: { reviews: reviewId },
        });
    
        // Delete review
        await Review.findByIdAndDelete(reviewId);
    
        res.redirect(`/listings/${id}`);
      };