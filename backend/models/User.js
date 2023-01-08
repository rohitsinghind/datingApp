const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },

  avatar: {
    type: String,
  },

  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: [true, "Email already exists"],
  },

  phoneNo: {
    type: String,
    unique: [true, "Phone Number already exists"],
  },

  age: {
    type: Number,
    required: [true, "Please enter your age"],
  },

  gender: {
    type: String,
    required: [true, "Please enter your gender"],
  },

  area: {
    type: String,
  },

  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },

  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  pendingMatches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  requestedMatches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  blockList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  createdAt:{
    type: Date
  },

});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

module.exports = mongoose.model("User", userSchema);
