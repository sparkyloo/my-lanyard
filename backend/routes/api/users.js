const express = require("express");
const { check } = require("express-validator");

const { User } = require("../../db/models");
const { setTokenCookie } = require("../../utils/auth");
const { validateRequest, finishBadRequest } = require("../../utils/validation");

const router = express.Router();

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
    const { firstName, lastName, email, password, username } =
      await validateRequest(req, [checkSignupEmail, checkSignupPassword]);

    const user = await User.signup({
      firstName,
      lastName,
      email,
      username,
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
    if (caught.name === "SequelizeUniqueConstraintError") {
      for (const err of caught.errors) {
        if (err.message === "email must be unique") {
          res.status(403);
          res.json({
            message: "User already exists",
            statusCode: 403,
            errors: {
              email: "User with that email already exists",
            },
          });

          return;
        }
      }
    }

    // handles everything except the user already exists error ^^^
    finishBadRequest(res, caught);
  }
});

module.exports = router;
