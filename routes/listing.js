const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// ---------------- INDEX ROUTE ----------------
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// ---------------- NEW ROUTE ----------------
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs", {
    listing: {},
    errors: {}
  });
});

// ---------------- CREATE ROUTE ----------------
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    await newListing.save();

    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
  })
);

// ---------------- EDIT ROUTE ----------------
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError("Invalid Listing ID", 400));
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return next(new ExpressError("Listing Not Found", 404));
    }

    res.render("listings/edit.ejs", { listing });
}));

// ---------------- SHOW ROUTE ----------------
router.get("/:id", wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError("Invalid Listing ID", 400));
  }
  const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    });
  if (!listing) {
    return next(new ExpressError("Listing Not Found", 404));
  }
  res.render("listings/show.ejs", { listing });
}));

// ---------------- UPDATE ROUTE ----------------
router.put("/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError("Invalid Listing ID", 400));
    }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}));

// ---------------- DELETE ROUTE ----------------
router.delete("/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError("Invalid Listing ID", 400));
    }

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;