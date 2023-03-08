const { validationResult } = require("express-validator");

async function validateRequest(req, validators) {
  await Promise.all(validators.map((validation) => validation.run(req)));

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw errors.array();
  }

  return req.body;
}

function finishBadRequest(res, caught) {
  let statusCode = 400;
  let message = "Request validation failed";
  let errors = [];

  if (caught && !Array.isArray(caught)) {
    if (typeof caught === "string") {
      message = caught;
    } else if (typeof caught === "object") {
      switch (caught.name) {
        case "SequelizeUniqueConstraintError": {
          for (const err of caught.errors) {
            if (err.message === "email must be unique") {
              statusCode = 403;
              message = "User already exists";
              errors.push({
                reason: "User with that email already exists",
              });

              break;
            }
          }
        }
        default: {
          statusCode = caught.statusCode || 500;

          if ("message" in caught) {
            message = caught.message;
          }

          if ("detail" in caught) {
            errors.push({
              reason: caught.detail,
            });
          }
        }
      }
    }
  } else {
    for (const validationError of caught || []) {
      if (typeof validationError === "object" && "msg" in validationError) {
        errors.push({
          reason: validationError.msg,
        });
      } else if (typeof validationError === "string") {
        errors.push({
          reason: validationError,
        });
      }
    }

    if (!errors.length) {
      statusCode = 500;
      message = "An unexplained error occured";
    }
  }

  res.status(statusCode);
  res.json({
    statusCode,
    message,
    errors,
  });
}

function finishPostRequest(res, instance) {
  res.status(201);
  res.json(instance);
}

function finishGetRequest(res, data) {
  if (data) {
    res.status(200);
    res.json(data);

    return true;
  }

  return false;
}

function finishPatchRequest(res, instance) {
  res.status(200);
  res.json(instance);
}

function finishPatchRequest(res, instance) {
  res.status(200);
  res.json(instance);
}

function finishDeleteRequest(res) {
  res.status(204);
  res.end();
}

module.exports = {
  validateRequest,
  finishBadRequest,
  finishPostRequest,
  finishGetRequest,
  finishPatchRequest,
  finishDeleteRequest,
};
