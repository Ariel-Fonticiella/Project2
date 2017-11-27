const mongoose = require("mongoose");


const Schema = mongoose.Schema;


// the schema defines the structure of documents in this collection
const judgeSchema = new Schema({
    // name of the judge
    name: {
      type: String,
      required: [true, "Judge's name is required."]
    },

    // circuit of the judge
    circuit: {
      type: Number,
      required: [true, "Please indicate which Circuit Court your Judge is located in."],
      min: [0, "Circuit can't be negative."]
    },

    // URL of an image file to use in <img src="??">
    imageUrl: {
      type: String,
      required: [true, "Please provide an image URL."]
    },

    // description of the judge
    description: {
      type: String,
      maxlength: [300, "Sorry, your description is too long."]
    },

    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User" // Has to be name of collection in user-model
    },

    // when the judge was added to the system
    dateAdded: { type: Date }
});

// the model has the methods to make database queries
const JudgeModel = mongoose.model("Judge", judgeSchema);
              //                        |
              // collection name is "judges"


module.exports = JudgeModel;
