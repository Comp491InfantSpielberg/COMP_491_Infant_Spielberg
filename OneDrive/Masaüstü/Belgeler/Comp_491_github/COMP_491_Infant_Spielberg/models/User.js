const mongoose = require("mongoose");
const { isEmail, contains } = require("validator");
const filter = require("../util/filter");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  if (filter.isProfane(this.username)) {
    throw new Error("Username cannot contain profanity");
  }

  next();
});

module.exports = mongoose.model("user", UserSchema);
