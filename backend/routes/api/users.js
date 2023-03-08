const express = require("express");
const { check } = require("express-validator");

const { User } = require("../../db/models");
const { setTokenCookie } = require("../../utils/auth");
const { validateRequest, finishBadRequest } = require("../../utils/validation");

const router = express.Router();

const checkSignupFirstName = check("firstName")
  .exists({ checkFalsy: true })
  .isString()
  .withMessage("Please provide a valid first name.");

const checkSignupLastName = check("lastName")
  .exists({ checkFalsy: true })
  .isString()
  .withMessage("Please provide a valid last name.");

const checkSignupEmail = check("email")
  .exists({ checkFalsy: true })
  .isEmail()
  .withMessage("Please provide a valid email.");

const checkSignupPassword = check("password")
  .exists({ checkFalsy: true })
  .isLength({ min: 6 })
  .withMessage("Password must be 6 characters or more.");

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = await validateRequest(
      req,
      [
        checkSignupFirstName,
        checkSignupLastName,
        checkSignupEmail,
        checkSignupPassword,
      ]
    );

    const user = await User.signup({
      firstName,
      lastName,
      email,
      password,
    });

    const token = setTokenCookie(res, user);

    res.json({
      id: user.id,
      firstName,
      lastName,
      email,
      token,
    });
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

module.exports = router;
