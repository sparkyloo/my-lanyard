const express = require("express");
const { check } = require("express-validator");
const { Lanyard } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { addTaggingRoutes } = require("../../utils/tagging");
const { notAllowed, notFound } = require("../../utils/errors");
const {
  validateRequest,
  finishBadRequest,
  finishPostRequest,
  finishGetRequest,
  finishPatchRequest,
  finishDeleteRequest,
} = require("../../utils/validation");

const router = express.Router();

module.exports = router;

module.exports.maybeGetLanyard = maybeGetLanyard;

addTaggingRoutes(router, "lanyardId", maybeGetLanyard);

async function maybeGetLanyard(req, authorId, options = {}) {
  const instance = await Lanyard.findByPk(req.params.id, options);

  if (instance) {
    if (!!authorId && authorId !== instance.authorId) {
      throw notAllowed();
    }

    return instance;
  } else {
    throw notFound("Lanyard");
  }
}

function getLanyardValues({ body }) {
  const values = {};

  if ("name" in body) {
    values.name = body.name;
  }

  if ("description" in body) {
    values.description = body.description;
  }

  return values;
}

const checkLanyardNameExists = check("name")
  .exists({ checkFalsy: true })
  .withMessage("Lanyards must have a name");

const checkLanyardDescriptionExists = check("description")
  .exists({ checkFalsy: true })
  .withMessage("Lanyard must have a description");

/**
 * create
 */
router.post("/", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const { name, description } = await validateRequest(req, [
      checkLanyardNameExists,
      checkLanyardDescriptionExists,
    ]);

    finishPostRequest(
      res,
      await Lanyard.create({
        name,
        description,
        authorId: user.id,
      })
    );
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

/**
 * read
 */
router.get("/", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    finishGetRequest(
      res,
      await Lanyard.findAll({
        where: {
          authorId: user.id,
        },
      })
    );
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/instance/:id", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const instance = await maybeGetLanyard(req, user.id);

    finishGetRequest(res, instance);
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

/**
 * update
 */
router.patch("/instance/:id", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const instance = await maybeGetLanyard(req, user.id);

    await instance.update(getLanyardValues(req));

    finishPatchRequest(res, instance);
  } catch (caught) {
    finishBadRequest(caught);
  }
});

/**
 * delete
 */
router.delete("/instance/:id", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const instance = await maybeGetLanyard(req, user.id);

    await instance.destroy();

    finishDeleteRequest(res);
  } catch (caught) {
    finishBadRequest(caught);
  }
});
