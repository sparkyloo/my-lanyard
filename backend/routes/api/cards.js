const express = require("express");
const { Card, Icon } = require("../../db/models");
const { requireAuth, restoreUser } = require("../../utils/auth");
const { includeTaggings, addTaggingRoutes } = require("../../utils/tagging");
const { notAllowed, notFound } = require("../../utils/errors");
const { inList, userCanViewItem, byUserOrSystem } = require("../../utils/misc");
const {
  finishBadRequest,
  finishPostRequest,
  finishGetRequest,
  finishPatchRequest,
  finishDeleteRequest,
  createRequiredCheck,
  validateRequest,
} = require("../../utils/validation");
const { maybeGetIcon } = require("./icons");

const includeIconAndTagging = (authorId) => [
  {
    as: "icon",
    model: Icon,
    where: {
      authorId: byUserOrSystem(authorId),
    },
    include: includeTaggings(authorId),
  },
  includeTaggings(authorId),
];

const router = express.Router();

module.exports = router;

module.exports.maybeGetCard = maybeGetCard;
module.exports.maybeGetManyCards = maybeGetManyCards;

addTaggingRoutes(router, "cardId", maybeGetCard, maybeGetManyCards);

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

  if ("iconId" in body) {
    values.iconId = body.iconId;
  }

  return values;
}

const checkIconIdExists = createRequiredCheck("Icon", (body) => body.iconId);

/**
 * create
 */
router.post("/", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const { text, iconId } = await validateRequest(req, [checkIconIdExists]);

    await maybeGetIcon(iconId, user.id);

    const instance = await Card.create({
      text,
      iconId,
      authorId: user.id,
    });

    await instance.reload({
      include: includeIconAndTagging(user.id),
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
    const user = await restoreUser(req, res);

    finishGetRequest(
      res,
      await Card.findAll({
        where: {
          authorId: byUserOrSystem(user?.id),
        },
        include: includeIconAndTagging(user?.id),
      })
    );
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/instance/:id", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const instance = await maybeGetCard(req.params.id, user?.id, {
      include: includeIconAndTagging(user?.id),
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
      include: includeIconAndTagging(user.id),
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
