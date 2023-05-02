const express = require("express");
const { Lanyard } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { includeTaggings, addTaggingRoutes } = require("../../utils/tagging");
const { notAllowed, notFound } = require("../../utils/errors");
const { userCanViewItem, byUserOrSystem } = require("../../utils/misc");
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

addTaggingRoutes(router, "lanyardId", maybeGetLanyard);

async function maybeGetLanyard(instanceId, userId, options = {}) {
  const instance = await Lanyard.findByPk(instanceId, options);

  if (instance) {
    if (!userCanViewItem(userId, instance.authorId)) {
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

const checkLanyardNameExists = createRequiredCheck("Name", (body) => body.name);

const checkLanyardDescriptionExists = createRequiredCheck(
  "Description",
  (body) => body.description
);

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
      checkLanyardDescriptionExists,
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
      include: "cards",
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
      await Lanyard.findAll({
        where: {
          authorId: byUserOrSystem(user.id),
        },
        include: ["taggings", "cards"],
      })
    );
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/instance/:id", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const instance = await maybeGetLanyard(req.params.id, user.id, {
      include: includeTaggings,
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
      include: includeTaggings,
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
