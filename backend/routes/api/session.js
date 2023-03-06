const express = require("express");
const { check } = require("express-validator");
const { User } = require("../../db/models");
const {
  setTokenCookie,
  deleteTokenCookie,
  restoreUser,
} = require("../../utils/auth");
const { notRecognized } = require("../../utils/errors");
const { finishBadRequest } = require("../../utils/validation");

const router = express.Router();

// Restore session user
router.get("/", async (req, res) => {
  const user = await restoreUser(req, res);

  if (user) {
    const token = setTokenCookie(res, user);

    res.json({
      ...user.toSafeObject(),
      token,
    });
  } else {
    res.json(null);
  }
});

router.delete("/", (req, res) => {
  deleteTokenCookie(res);

  return res.json(null);
});

const checkLoginCredential = check("credential")
  .exists({ checkFalsy: true })
  .notEmpty()
  .withMessage("Please provide a valid email.");

const checkLoginPassword = check("password")
  .exists({ checkFalsy: true })
  .withMessage("Please provide a password.");

router.post("/", async (req, res, next) => {
  try {
    const { credential, password } = await validateRequest(req, [
      checkLoginCredential,
      checkLoginPassword,
    ]);

    const user = await User.login({ credential, password });

    if (!user) {
      throw notRecognized();
    }

    const token = setTokenCookie(res, user);

    return res.json({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
    });
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

module.exports = router;
