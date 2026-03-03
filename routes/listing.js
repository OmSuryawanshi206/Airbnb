const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

// ---------------- VALIDATION ----------------
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(errMsg, 400));
  }
  next();
};

// ---------------- INDEX ROUTE ----------------
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// ---------------- NEW ROUTE ----------------
router.get("/new", (req, res) => {
  res.render("listings/new.ejs", {
    listing: {},
    errors: {}
  });
});

// ---------------- CREATE ROUTE ----------------
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// ---------------- EDIT ROUTE ----------------
router.get("/:id/edit", wrapAsync(async (req, res, next) => {
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
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError("Invalid Listing ID", 400));
  }

  const listing = await Listing.findById(id).populate("reviews");

  if (!listing) {
    return next(new ExpressError("Listing Not Found", 404));
  }

  res.render("listings/show.ejs", { listing });
}));

// ---------------- UPDATE ROUTE ----------------
router.put("/:id",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError("Invalid Listing ID", 400));
    }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    res.redirect(`/listings/${id}`);
  })
);

// ---------------- DELETE ROUTE ----------------
router.delete("/:id", wrapAsync(async (req, res, next) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError("Invalid Listing ID", 400));
  }

  await Listing.findByIdAndDelete(id);

  res.redirect("/listings");
}));

module.exports = router;