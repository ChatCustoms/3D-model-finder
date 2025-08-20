const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: { type: String, required: true, select: false },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) throw new Error("Incorrect email or password");
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) throw new Error("Incorrect email or password");
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
