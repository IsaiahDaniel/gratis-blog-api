const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");

const { body } = require("express-validator");

router.post(
  "/",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Email Is required").not().isEmpty(),
    body("password", "Password must be atleast six characters").isLength({
      min: 6,
    }),
  ],
  usersController.signup
);

module.exports = router;
