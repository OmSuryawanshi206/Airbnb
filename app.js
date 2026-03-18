const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");
const userRoutes = require("./routes/user.js");

const ExpressError = require("./utils/ExpressError.js");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

const { isLoggedIn } = require("./middleware.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// ================= DATABASE =================
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

// ================= VIEW ENGINE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ================= MIDDLEWARE =================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ================= SESSION =================
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: false, // ✅ FIXED
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ================= PASSPORT =================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= FLASH LOCALS =================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ================= ROUTES =================

// Home
app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

// User routes
app.use("/", userRoutes);

// Listing routes
app.use("/listings", listingRoutes);

// Review routes
app.use("/listings/:id/reviews", reviewRoutes);

// ================= DEMO USER =================
app.get("/create-demo-user", async (req, res) => {
  let fakeUser = new User({
    username: "demoUser",
    email: "om@gmail.com",
  });

  let registeredUser = await User.register(fakeUser, "password123");

  res.send("Demo user created with username: demoUser and password: password123");
});

// ================= 404 =================
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    err = new ExpressError("Invalid ID", 400);
  }

  let { statusCode = 500, message = "Something Went Wrong" } = err;

  console.error("ERROR:", err);

  res.status(statusCode).render("error.ejs", {
    message,
    statusCode,
  });
});