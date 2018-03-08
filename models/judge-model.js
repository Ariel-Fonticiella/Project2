const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const documentSchema = new Schema(
  // 1st argument -> SCHEMA STRUCTURE
  {
      name: {
        type: String,
        required: [true, "Please give your document a name"]
      },
      photoUrl: {
        type: String,
      },
      description: { type: String },

      owner: {
        type: Schema.Types.ObjectId,
      }
  },

  // 2nd argument -> SETTINGS object
  {
      // automatically add "createdAt" and "updatedAt" Date fields
      timestamps: true
  }
);

const DocumentModel = mongoose.model("Document", documentSchema);


module.exports = DocumentModel;
