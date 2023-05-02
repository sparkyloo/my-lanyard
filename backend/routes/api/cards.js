const express = require("express");
const { Card } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { includeTaggings, addTaggingRoutes } = require("../../utils/tagging");
const { notAllowed, notFound } = require("../../utils/errors");
const { inList, userCanViewItem, byUserOrSystem } = require("../../utils/misc");
const {
  finishBadRequest,
  finishPostRequest,
  finishGetRequest,
  finishPatchRequest,
  finishDeleteRequest,
} = require("../../utils/validation");
const { maybeGetIcon } = require("./icons");

const includeIconAndTagging = ["icon", includeTaggings];

const router = express.Router();

module.exports = router;

module.exports.maybeGetCard = maybeGetCard;
module.exports.maybeGetManyCards = maybeGetManyCards;

addTaggingRoutes(router, "cardId", maybeGetCard);

async function maybeGetCard(instanceId, userId, options = {}) {
  const instance = await Card.findByPk(instanceId, options);

  if (instance) {
    if (!userCanViewItem(userId, instance.authorId)) {
      throw notAllowed();
    }

    return instance;
  } else {
    throw notFound("Card");
  }
}

async function maybeGetManyCards(instanceIds, userId, options = {}) {
  const instances = await Card.findAll({
    ...options,
    where: {
      id: inList(instanceIds),
      authorId: byUserOrSystem(userId),
    },
  });

  for (const instance of instances) {
    if (!userCanViewItem(userId, instance.authorId)) {
      throw notAllowed();
    }
  }

  if (instances.length < instanceIds.length) {
    throw notFound("Card");
  } else {
    return instances;
  }
}

function getCardValues({ body }) {
  const values = {};

  if ("text" in body) {
    values.text = body.text;
  }

  return values;
}

/**
 * create
 */
router.post("/", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    await maybeGetIcon(req.body.iconId, user.id);

    const instance = await Card.create({
      text: req.body.text,
      iconId: req.body.iconId,
      authorId: user.id,
    });

    await instance.reload({
      include: "icon",
    });

    finishPostRequest(res, instance);
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
          authorId: byUserOrSystem(user.id),
        },
        include: includeIconAndTagging,
      })
    );
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/instance/:id", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const instance = await maybeGetCard(req.params.id, user.id, {
      include: includeIconAndTagging,
    });

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

    const instance = await maybeGetCard(req.params.id, user.id, {
      include: includeTaggings,
    });

    await instance.update(getCardValues(req));

    finishPatchRequest(res, instance);
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

/**
 * delete
 */
router.delete("/instance/:id", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const instance = await maybeGetCard(req.params.id, user.id);

    await instance.destroy();

    finishDeleteRequest(res);
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});
