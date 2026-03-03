const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const {listingSchema ,reviewSchema } = require("./schema.js");

const ExpressError = require("./utils/ExpressError.js");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const wrapAsync = require("./utils/wrapAsync.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// ----------------- DATABASE CONNECTION -----------------
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    app.listen(8080, () => {
      console.log("Server is listening on port 8080");
    });
  } catch (err) {
    console.log("Mongo connection error:", err);
  }
}

main();

// ----------------- MIDDLEWARE -----------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ----------------- HOME ROUTE -----------------
app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

// ----------------- VALIDATION -----------------

// ----------------- REVIEW ROUTES -----------------

app.use("/listings/:id/reviews", reviewRoutes);
// ----------------- LISTING ROUTES -----------------
app.use("/listings", listingRoutes);



// ----------------- 404 handler -----------------
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// ----------------- GLOBAL ERROR HANDLER -----------------
app.use((err, req, res, next) => {
  // Handle Mongoose CastError (Invalid ObjectId)
  if (err.name === "CastError") {
    err = new ExpressError("Invalid ID", 400);
  }
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  console.error("ERROR:", err);
  res.status(statusCode).render("error.ejs", { 
  message,
  statusCode
});
});