const mongoose = require("mongoose");


const Schema = mongoose.Schema;


// the schema defines the structure of documents in this collection
const forumSchema = new Schema({
    // text that the reviewer writes
    content: { type: String },

    // rating that the reviewer gives the product
    stars: {
      type: Number,
      required: [true, "Please rate this Judge."],
      min: [1, "Rating can't be less than 1."],
      max: [5, "Rating can't be greater than 5."]
    },

    // name of the reviewer
    userName: {
      type: String,
      required: [true, "Please enter your User Name."],
      minlength: [3, "Your name must be at least 3 characters long."]
    }
});

// the model has the methods to make database queries
const ForumModel = mongoose.model("Forum", forumSchema);
             //                        |
             // collection name is "forums"


module.exports = ForumModel;
