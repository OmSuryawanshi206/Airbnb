const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingsController = require("../controllers/listings.js");




router.route("/")
.get( wrapAsync(listingsController.index))
.post(isLoggedIn, validateListing, wrapAsync( listingsController.create));


router.route("/new")
.get(isLoggedIn, listingsController.new);


router.route("/:id")
.get(wrapAsync(listingsController.show))
.put(isLoggedIn, isOwner, validateListing, wrapAsync(listingsController.update))
.delete(isLoggedIn, isOwner, wrapAsync(listingsController.delete));

router.route("/:id/edit")
.get(isLoggedIn, isOwner, wrapAsync(listingsController.edit));



// ---------------- INDEX ROUTE ----------------
// ---------------- NEW ROUTE ----------------
// ---------------- CREATE ROUTE ----------------
// ---------------- EDIT ROUTE ----------------
// ---------------- SHOW ROUTE ----------------
// ---------------- UPDATE ROUTE ----------------
// ---------------- DELETE ROUTE ----------------

module.exports = router;