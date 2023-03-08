const express = require("express");
const { check } = require("express-validator");
const { Icon } = require("../../db/models");
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

addTaggingRoutes(router, "iconId", maybeGetIcon);

async function maybeGetIcon(req, authorId, options = {}) {
  const instance = await Icon.findByPk(req.params.id, options);

  if (instance) {
    if (typeof authorId !== "undefined" && authorId !== instance.authorId) {
      throw notAllowed();
    }

    return instance;
  } else {
    throw notFound("Icon");
  }
}

function getIconValues({ body }) {
  const values = {};

  if ("name" in body) {
    values.name = body.name;
  }

  if ("imageUrl" in body) {
    values.imageUrl = body.imageUrl;
  }

  return values;
}

const checkIconNameExists = check("name")
  .exists({ checkFalsy: true })
  .withMessage("Icons must have a name");

const checkIconImageUrlExists = check("imageUrl")
  .exists({ checkFalsy: true })
  .withMessage("Icon must have a imageURL");

const checkIconImageUrlIsUrl = check("imageUrl")
  .isURL()
  .withMessage("Icon image must be a valid URL");

/**
 * create
 */
router.post("/", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const { name, imageUrl } = await validateRequest(req, [
      checkIconNameExists,
      checkIconImageUrlExists,
      checkIconImageUrlIsUrl,
    ]);

    finishPostRequest(
      res,
      await Icon.create({
        name,
        imageUrl,
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
      await Icon.findAll({
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

    const instance = await maybeGetIcon(req, user.id);

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

    await validateRequest(req, [checkIconImageUrlIsUrl]);

    const instance = await maybeGetIcon(req, user.id);

    await instance.update(getIconValues(req));

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

    const instance = await maybeGetIcon(req, user.id);

    await instance.destroy();

    finishDeleteRequest(res);
  } catch (caught) {
    finishBadRequest(caught);
  }
});

module.exports = router;
