const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");

// ---------------- INDEX ROUTE ----------------
router.get("/", wrapAsync(listingsController.index));


// ---------------- NEW ROUTE ----------------
router.get("/new", isLoggedIn, listingsController.new);
console.log("New route accessed");

// ---------------- CREATE ROUTE ----------------
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync( listingsController.create)
);

// ---------------- EDIT ROUTE ----------------
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.edit)
);

// ---------------- SHOW ROUTE ----------------
router.get("/:id", wrapAsync(listingsController.show));

// ---------------- UPDATE ROUTE ----------------
router.put("/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingsController.update)
);

// ---------------- DELETE ROUTE ----------------
router.delete("/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.delete)
);

module.exports = router;