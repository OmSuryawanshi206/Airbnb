const Listing = require("../models/listing");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");


//------------------ Index Route -----------------
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//------------------ New Route -----------------
module.exports.new =  (req, res) => {
  res.render("listings/new.ejs", {
    listing: {},
    errors: {}
  });
};

//------------------ Create Route -----------------
module.exports.create = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
  };

//------------------ Edit Route -----------------
  module.exports.edit = async (req, res, next) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError("Invalid Listing ID", 400));
    }
    const listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError("Listing Not Found", 404));
    }
    res.render("listings/edit.ejs", { listing });
};

//------------------ Show Route -----------------
module.exports.show = async (req, res, next) => {
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
};async (req, res, next) => {
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
};

//------------------ Update Route -----------------
module.exports.update = async (req, res, next) => {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError("Invalid Listing ID", 400));
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

//------------------ Delete Route -----------------
module.exports.delete = async (req, res, next) => {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ExpressError("Invalid Listing ID", 400));
    }

    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};