const mongoose = require("mongoose");
const Review = require("./reviews.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    filename: String,
    url: {
      type: String,
      default: "https://www.theexcelsiorhotel.com.ph/wp-content/uploads/2024/01/Best-Luxury-Hotels-in-Manila-The-Excelsior-Hotel.jpg"
    },
  },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Review"
    }
  ],
  createdAt: {  
    type: Date,
    default: Date.now()
  }
});

listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await mongoose.model("Review").deleteMany({ 
      _id: { $in: doc.reviews }
    });
  }
});


module.exports = mongoose.model("Listing", listingSchema);
