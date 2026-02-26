const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateAccesToken, generateRefreshToken } = require("../auth/generateTokens");
const getUserInfo = require("../lib/getUserInfo");
const Token = require("../schema/token");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.createAccesToken = function () {
    return generateAccesToken(getUserInfo(this));
};
UserSchema.methods.createRefreshToken = async function () {
    const refreshToken = generateRefreshToken(getUserInfo(this));
    try {
        await new Token ({token: refreshToken}).save();

        return refreshToken;
    }catch (error) {
        console.log(error);
    }
};

module.exports = mongoose.model("User", UserSchema);
