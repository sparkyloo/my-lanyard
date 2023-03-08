const jwt = require("jsonwebtoken");
const { notRecognized } = require("./errors");
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

/**
 * @returns {Promise<User | null>}
 */
async function restoreUser(req, res) {
  if (req.user) {
    return req.user;
  }

  // token parsed from cookies
  const { token } = req.cookies;

  if (!token) {
    return null;
  }

  return new Promise((resolve) => {
    let user = null;

    jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (!err) {
        try {
          const { id } = jwtPayload.data;

          req.user = user = await User.scope("currentUser").findByPk(id);

          if (!user) {
            res.clearCookie("token");
          }
        } catch (caught) {
          res.clearCookie("token");
        }
      }

      resolve(user);
    });
  });
}

async function requireAuth(req, res) {
  const user = await restoreUser(req, res);

  if (user) {
    return user;
  } else {
    throw notRecognized();
  }
}

module.exports = {
  setTokenCookie,
  deleteTokenCookie,
  restoreUser,
  requireAuth,
};
