// backend/utils/validation.js
const { validationResult } = require("express-validator");

async function validateRequest(req, validators) {
  await Promise.all(validators.map((validation) => validation.run(req)));

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw errors.array();
  }
}

function finishBadRequest(res, errors) {
  let statusCode = 400;

  if (!Array.isArray(errors)) {
    if (errors instanceof Error) {
      statusCode = 500;
      errors = [
        {
          reason: errors.message,
        },
      ];
    } else if (typeof errors === "string") {
      errors = [
        {
          reason: errors,
        },
      ];
    }
  }

  errors = errors
    .map((validationError) => {
      if (typeof validationError === "object" && "msg" in validationError) {
        return {
          reason: validationError.msg,
        };
      }

      return null;
    })
    .filter(Boolean);

  if (!errors || !errors.length) {
    statusCode = 500;

    errors = [
      {
        reason: "An unexplained error occured",
      },
    ];
  }

  res.status(statusCode);
  res.json({
    statusCode,
    message: "Request validation failed",
    errors,
  });
}

function finishNotFound(resourceType, res) {
  res.status(404);
  res.json({
    statusCode: 404,
    message: `${resourceType} was not be found`,
  });
}

module.exports = {
  validateRequest,
  finishBadRequest,
  finishNotFound,
};
