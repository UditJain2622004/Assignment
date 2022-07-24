const express = require("express");
const userController = require("./../controllers/userController.js");

const router = express.Router();

router.get("/", userController.getAllUsers);

router.post("/signup", userController.signup);
router.post("/signin", userController.signin);

router.patch(
  "/updatePassword",
  userController.requireSignIn,
  userController.updatePassword
);
router.patch("/:id", userController.updateUser);

module.exports = router;
