const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// new Schema({ schema }, { settings }) -- This is the basic structure:
const userSchema = new Schema(
  // 1st argument -> SCHEMA STRUCTURE
  {
    userName: {
      type: String,
      required: [true, "Give us your User Name."]
    },

    avatar: {
      type: String,
      default: "/images/default-avatar.png"
    },

    encryptedPassword: {
      type: String,
    },

    // normal login users:
    email: {
      type: String,
      match: [/.+@.+/, "Emails need an @ sign"]
    }
  },
    // 2nd argument -> SETTINGS object
  {
    // automatically add "createdAt" and "updatedAt" Date fields
    timestamps: true
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
