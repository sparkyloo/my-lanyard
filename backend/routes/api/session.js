const express = require("express");
const { User } = require("../../db/models");
const {
  setTokenCookie,
  deleteTokenCookie,
  restoreUser,
} = require("../../utils/auth");
const { notRecognized } = require("../../utils/errors");
const {
  validateRequest,
  finishBadRequest,
  createMultipleChecks,
} = require("../../utils/validation");

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

const checkLoginCredential = createMultipleChecks(
  "Email",
  (body) => body.credential,
  (check) => [check.exists(), check.isEmail()]
);

const checkLoginPassword = createMultipleChecks(
  "Password",
  (body) => body.password,
  (check) => [check.exists(), check.lengthIsGte(6)]
);

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
      ...user.toSafeObject(),
      token,
    });
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

module.exports = router;
