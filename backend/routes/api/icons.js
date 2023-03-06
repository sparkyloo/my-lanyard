const express = require("express");
const { check } = require("express-validator");
const { Icon } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { createTaggingRouter } = require("../../utils/tagging");
const { notFound } = require("../../utils/errors");
const {
  validateRequest,
  finishBadRequest,
  finishPostRequest,
  finishGetRequest,
  finishPatchRequest,
  finishDeleteRequest,
} = require("../../utils/validation");

const router = express.Router();

router.use("tagging", createTaggingRouter("cardId"));

async function maybeGetIcon(req) {
  const instance = await Icon.findByPk(req.params.id);

  if (instance) {
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
    await requireAuth(req, res);

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
    finishGetRequest(res, await Icon.findAll());
  } catch (caught) {
    finishBadRequest(caught, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    finishGetRequest(res, await maybeGetIcon(req));
  } catch (caught) {
    finishBadRequest(caught, res);
  }
});

/**
 * update
 */
router.patch("/:id", [iconValidators.imageUrl.isUrl], async (req, res) => {
  try {
    await validateRequest(req, [checkIconImageUrlIsUrl]);

    const icon = await maybeGetIcon(req);
    await icon.update(getIconValues(req));

    finishPatchRequest(res, icon);
  } catch (caught) {
    finishBadRequest(caught);
  }
});

/**
 * delete
 */
router.delete("/:id", async (req, res) => {
  try {
    const icon = await maybeGetIcon(req);
    await icon.destroy();

    finishDeleteRequest(res);
  } catch (caught) {
    finishBadRequest(caught);
  }
});

module.exports = router;
