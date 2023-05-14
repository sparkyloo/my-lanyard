const express = require("express");
const { Lanyard, Tagging, Card, Icon } = require("../../db/models");
const { requireAuth, restoreUser } = require("../../utils/auth");
const { includeTaggings, addTaggingRoutes } = require("../../utils/tagging");
const { notAllowed, notFound } = require("../../utils/errors");
const { userCanViewItem, byUserOrSystem, inList } = require("../../utils/misc");
const {
  validateRequest,
  finishBadRequest,
  finishPostRequest,
  finishGetRequest,
  finishPatchRequest,
  finishDeleteRequest,
  createRequiredCheck,
} = require("../../utils/validation");
const { maybeGetManyCards } = require("./cards");

const router = express.Router();

module.exports = router;

module.exports.maybeGetLanyard = maybeGetLanyard;
module.exports.maybeGetManyLanyards = maybeGetManyLanyards;

addTaggingRoutes(router, "lanyardId", maybeGetLanyard, maybeGetManyLanyards);

const includeCards = {
  as: "cards",
  model: Card,
  include: [
    {
      as: "icon",
      model: Icon,
    },
  ],
};

const includeCardsAndTaggings = [includeTaggings, includeCards];

async function maybeGetLanyard(instanceId, userId, options = {}) {
  const instance = await Lanyard.findByPk(instanceId, options);

  if (instance) {
    if (
      typeof userId !== "undefined" &&
      !userCanViewItem(userId, instance.authorId)
    ) {
      throw notAllowed();
    }

    return instance;
  } else {
    throw notFound("Lanyard");
  }
}

async function maybeGetManyLanyards(instanceIds, userId, options = {}) {
  const instances = await Lanyard.findAll({
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
    throw notFound("Lanyard");
  } else {
    return instances;
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

const checkLanyardNameExists = createRequiredCheck("Name", (body) => body.name);

const checkLanyardCardIdsExists = createRequiredCheck(
  "Cards",
  (body) => body.cardIds
);

/**
 * create
 */
router.post("/", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const { name, description, cardIds } = await validateRequest(req, [
      checkLanyardNameExists,
      checkLanyardCardIdsExists,
    ]);

    const cards = await maybeGetManyCards(cardIds, user.id);

    const instance = await Lanyard.create({
      name,
      description,
      authorId: user.id,
    });

    await instance.addCards(cards);

    await instance.reload({
      include: includeCardsAndTaggings,
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
      await Lanyard.findAll({
        where: {
          authorId: byUserOrSystem(user?.id),
        },
        include: includeCardsAndTaggings,
      })
    );
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/instance/:id", async (req, res) => {
  try {
    const user = await restoreUser(req, res);

    const instance = await maybeGetLanyard(req.params.id, user?.id, {
      include: includeCardsAndTaggings,
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

    const instance = await maybeGetLanyard(req.params.id, user.id, {
      include: includeCardsAndTaggings,
    });

    await instance.update(getLanyardValues(req));

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

    const instance = await maybeGetLanyard(req.params.id, user.id);

    await instance.destroy();

    finishDeleteRequest(res);
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});
