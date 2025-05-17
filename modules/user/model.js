const mongoose = require("mongoose");
const { scryptSync } = require("crypto"); //crypto is built-in module for Node.js for hashing

const db = require("../../db"); //shared db stuff

const UserSchema = new mongoose.Schema({
  user: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

async function authenticateUser(username, pw) {
  await db.connect();
  let key = scryptSync(pw, process.env.SALT, 64);
  //check for existing user with matching hashed password
  let result = await User.findOne({
    user: username,
    password: key.toString("base64"),
  });
  if (result) return true;
  else return false;
}

async function getUser(username) {
  await db.connect();
  //check if username exists already
  let result = await User.findOne({ user: username });
  return result ? result : false;
}

async function addUser(username, pw) {
  await db.connect();
  let user = await getUser(username);

  if (!user) {
    //add user if username doesn't exist
    let key = scryptSync(pw, process.env.SALT, 64);
    let newUser = new User({
      user: username,
      password: key.toString("base64"),
    });
    let result = await newUser.save();
    if (result === newUser) return true;
    else return false;
  } else {
    return false;
  }
}

module.exports = {
  authenticateUser,
  getUser,
  addUser,
};
