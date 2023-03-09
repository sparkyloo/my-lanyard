const express = require("express");
const { check } = require("express-validator");
const { Card } = require("../../db/models");
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

module.exports.maybeGetCard = maybeGetCard;

addTaggingRoutes(router, "cardId", maybeGetCard);

async function maybeGetCard(req, authorId, options = {}) {
  const instance = await Card.findByPk(req.params.id, options);

  if (instance) {
    if (!!authorId && authorId !== instance.authorId) {
      throw notAllowed();
    }

    return instance;
  } else {
    throw notFound("Card");
  }
}

function getCardValues({ body }) {
  const values = {};

  if ("text" in body) {
    values.text = body.text;
  }

  return values;
}

const checkCardTextIsString = check("text")
  .isString()
  .withMessage("Card text must be a string");

/**
 * create
 */
router.post("/", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const { text } = await validateRequest(req, [checkCardTextIsString]);

    finishPostRequest(
      res,
      await Card.create({
        text,
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
      await Card.findAll({
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

    const instance = await maybeGetCard(req, user.id);

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

    const instance = await maybeGetCard(req, user.id);

    await instance.update(getCardValues(req));

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

    const instance = await maybeGetCard(req, user.id);

    await instance.destroy();

    finishDeleteRequest(res);
  } catch (caught) {
    finishBadRequest(caught);
  }
});
