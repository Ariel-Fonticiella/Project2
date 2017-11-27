const mongoose = require("mongoose");


const Schema = mongoose.Schema;


// the schema defines the structure of documents in this collection
const reviewSchema = new Schema({
    // review belongs to a judge
    // (this is the judges's id)
    judge: {
      type: Schema.Types.ObjectId,
      required: [true, "Please specify the Judge for this review."]
    },
    // name of the reviewer
    userName: {
      type: String,
      required: [true, " User Name is required"],
      minlength: [3, "Your name must be at least 3 characters long."]
    },
    // rating that the reviewer gives the Judge
    stars: {
      type: Number,
      required: [true, "Please rate this product."],
      min: [1, "Rating can't be less than 1."],
      max: [5, "Rating can't be greater than 5."]
    },
    // text that the reviewer writes
    content: { type: String },
});

// the model has the methods to make database queries
const ReviewModel = mongoose.model("Review", reviewSchema);
             //                        |
             // collection name is "reviews"


module.exports = ReviewModel;
