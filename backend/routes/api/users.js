const express = require("express");
const { User } = require("../../db/models");
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");
const {
  validateRequest,
  finishBadRequest,
  createMultipleChecks,
  createRequiredCheck,
} = require("../../utils/validation");
const { conflict } = require("../../utils/errors");

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
  (body) => body.email,
  (check) => [check.exists(), check.isEmail()]
);

const checkSignupPassword = createMultipleChecks(
  "Password",
  (body) => body.password,
  (check) => [check.exists(), check.lengthIsGte(6)]
);

const checkCurrentPassword = createMultipleChecks(
  "Current Password",
  (body) => body.current,
  (check) => [check.exists(), check.lengthIsGte(6)]
);

const checkChangedPassword = createMultipleChecks(
  "Changed Password",
  (body) => body.changed,
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

    const existing = await User.findOne({
      where: {
        email,
      },
    });

    if (existing) {
      throw conflict(email);
    }

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

router.patch("/", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const { firstName, lastName, email } = await validateRequest(req, [
      checkSignupFirstName,
      checkSignupLastName,
      checkSignupEmail,
    ]);

    await user.update({
      firstName,
      lastName,
      email,
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

router.patch("/password", async (req, res) => {
  try {
    let user = await requireAuth(req, res);

    const { current, changed } = await validateRequest(req, [
      checkCurrentPassword,
      checkChangedPassword,
    ]);

    user = await User.changePassword({
      id: user.id,
      current,
      changed,
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
