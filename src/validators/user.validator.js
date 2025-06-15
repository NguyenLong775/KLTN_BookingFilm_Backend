const { body } = require("express-validator");

const signupValidator = [
  body("email").notEmpty().withMessage("Email must not be empty"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

module.exports = {
  signupValidator,
};
