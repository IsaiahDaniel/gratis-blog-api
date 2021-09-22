const bcryptjs = require("bcryptjs");
const Blog = require("../models/Blog");
const User = require("../models/User");
const { validationResult } = require("express-validator");

const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const { body } = require("express-validator");

const usersController = require("../controllers/usersController");

router.post(
  "/",
  [
    body("email", "Email Is required").not().isEmpty(),
    body("password", "Password is required").exists(),
  ],
  usersController.signin
);

module.exports = router;
