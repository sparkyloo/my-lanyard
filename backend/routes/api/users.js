const express = require("express");
const { User } = require("../../db/models");
const { setTokenCookie } = require("../../utils/auth");
const {
  validateRequest,
  finishBadRequest,
  createMultipleChecks,
  createRequiredCheck,
} = require("../../utils/validation");

const router = express.Router();

const checkSignupFirstName = createRequiredCheck(
  "First name",
  (body) => body.firstName
);

const checkSignupLastName = createRequiredCheck(
  "Last name",
  (body) => body.lastName
);

const checkSignupEmail = createMultipleChecks(
  "Email",
  (body) => body.firstName,
  (check) => [check.exists(), check.isEmail()]
);

const checkSignupPassword = createMultipleChecks(
  "Password",
  (body) => body.firstName,
  (check) => [check.exists(), check.lengthIsGte(6)]
);

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
      ...user.toSafeObject(),
      token,
    });
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

module.exports = router;
