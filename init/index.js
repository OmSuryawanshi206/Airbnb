const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { init } = require("../models/reviews.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("connected to DB");

    await Listing.deleteMany({});
    initData.data = initData.data.map((data) => {
      return { ...data, owner: "64a9c0f0f1a2b3c4d5e6f7g8" }; // Replace with actual user ID
    });
    await Listing.insertMany(initData.data);

    console.log("data was initialized");
  } catch (err) {
    console.log(err);
  } finally {
    mongoose.connection.close();
  }
}

main();
