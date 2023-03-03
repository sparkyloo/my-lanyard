const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
function setTokenCookie(res, user) {
  // Create the token.
  const token = jwt.sign(
    { data: user.toSafeObject() },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
}

function deleteTokenCookie(res) {
  // Set the token cookie
  res.clearCookie("token");
}

function restoreUser(req, res, next) {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next();
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.scope("currentUser").findByPk(id);
    } catch (e) {
      res.clearCookie("token");
      return next();
    }

    if (!req.user) {
      res.clearCookie("token");
    }

    return next();
  });
}

function requireAuth(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401);
    res.json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
}

module.exports = {
  setTokenCookie,
  deleteTokenCookie,
  restoreUser,
  requireAuth,
};
