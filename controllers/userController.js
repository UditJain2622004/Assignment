const User = require("./../models/userModel.js");
const jwt = require("jsonwebtoken");
const util = require("util");

const filterObj = (obj, allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

// TO SIGN JWT TOKENS
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//CREATES A TOKEN,COOKIE , ADDS THE COOKIE TO RESPONSE , AND SENDS THE RESPONSE
const createSendToken = (user, res, statusCode) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// GET ALL USERS
exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    Results: users.length,
    data: {
      users,
    },
  });
};

// NEW REGISTRATION
exports.signup = async (req, res, next) => {
  //prettier-ignore
  const details = filterObj(req.body,["name","email","password","passwordConfirm"]);

  const user = await User.create(details);

  createSendToken(user, res, 201);
};

// LOG IN
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    //prettier-ignore
    return res.status(400).json({ message: "Please provide email and password!" });

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return res.status(400).json({ message: "Invalid email or password!" });
  }

  createSendToken(user, res, 200);
};

// UPDATE USER PROFILE
exports.updateUser = async (req, res, next) => {
  const details = filterObj(req.body, "name", "email");

  const user = await User.findByIdAndUpdate(req.params.id, details, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

// UPDATE PASSWORD
exports.updatePassword = async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  const password = req.body.currentPassword;

  // checks if the password entered is correct
  if (!(await user.checkPassword(password, user.password))) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // new password should not be same as old password
  if (await user.checkPassword(req.body.newPassword, user.password)) {
    //prettier-ignore
    return res.status(400).json({ message: "New password cannot be same as old password" });
  }

  // update the password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, res, 200);
};

// FOR PROTECTED ROUTES LIKE updatePassword
exports.requireSignIn = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ message: "You are not logged in" });

  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decoded.id);
  if (!user) return res.status(401).json({ message: "You are not logged in" });

  if (user.passwordChangedAfter(decoded.iat))
    return res.status(401).json({ message: "You are not logged in" });

  req.user = user;
  next();
};
