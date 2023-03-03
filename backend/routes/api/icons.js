const express = require("express");
const { check } = require("express-validator");
const { Icon } = require("../../db/models");
const { createTaggingRouter } = require("../../utils/tagging");
const {
  validateRequest,
  finishBadRequest,
  finishNotFound,
} = require("../../utils/validation");

const router = express.Router();

// router.use(requireAuth)

router.use("tagging", createTaggingRouter("cardId"));

async function maybeGetIcon(req, res) {
  try {
    const instance = await Icon.findByPk(req.params.id);

    if (instance) {
      return instance;
    } else {
      finishNotFound("Icon");
    }
  } catch (caught) {
    finishBadRequest(res, caught);
  } finally {
    return null;
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
    const { name, imageUrl } = await validateRequest(req, [
      checkIconNameExists,
      checkIconImageUrlExists,
      checkIconImageUrlIsUrl,
    ]);

    const icon = await Icon.create({
      name,
      imageUrl,
    });

    res.status(201);
    res.json(icon);
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

/**
 * read
 */
router.get("/", async (req, res) => {
  try {
    const icons = await Icon.findAll();

    res.status(200);
    res.json(icons);
  } catch (caught) {
    finishBadRequest(caught, res);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const icon = await maybeGetIcon(req, res);

    if (icon) {
      res.status(200);
      res.json(icon);
    }
  } catch (caught) {
    finishBadRequest(caught, res);
  }
});

/**
 * update
 */
router.patch("/:id", [iconValidators.imageUrl.isUrl], async (req, res) => {
  const icon = await maybeGetIcon(req, res);

  if (icon) {
    await icon.update(getIconValues(req));

    res.status(200);
    res.json(icon);
  }
});

/**
 * delete
 */
router.delete("/:id", async (req, res) => {
  const icon = await maybeGetIcon(req, res);

  if (icon) {
    await icon.destroy();

    res.status(204);
    res.end();
  } else {
    res.status(404);
    res.end();
  }
});

module.exports = router;
