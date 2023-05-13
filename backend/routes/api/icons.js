const express = require("express");
const { Icon } = require("../../db/models");
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
  createMultipleChecks,
  createUrlCheck,
} = require("../../utils/validation");
const { Op } = require("sequelize");

const router = express.Router();

module.exports = router;

module.exports.maybeGetIcon = maybeGetIcon;
module.exports.maybeGetManyIcons = maybeGetManyIcons;

addTaggingRoutes(router, "iconId", maybeGetIcon, maybeGetManyIcons);

async function maybeGetIcon(instanceId, userId, options = {}) {
  const instance = await Icon.findByPk(instanceId, options);

  if (instance) {
    if (!userCanViewItem(userId, instance.authorId)) {
      throw notAllowed();
    }

    return instance;
  } else {
    throw notFound("Icon");
  }
}

async function maybeGetManyIcons(instanceIds, userId, options = {}) {
  const instances = await Icon.findAll({
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
    throw notFound("Icon");
  } else {
    return instances;
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

const checkIconNameExists = createRequiredCheck("Name", (body) => body.name);

const checkIconImageUrlExists = createMultipleChecks(
  "Image",
  (body) => body.imageUrl,
  (check) => [check.exists(), check.isUrl()]
);

const checkIconImageUrlIsUrl = createUrlCheck("Image", (body) => body.imageUrl);

/**
 * create
 */
router.post("/", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const { name, imageUrl } = await validateRequest(req, [
      checkIconNameExists,
      checkIconImageUrlExists,
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
    const user = await restoreUser(req, res);

    finishGetRequest(
      res,
      await Icon.findAll({
        where: {
          authorId: byUserOrSystem(user?.id),
        },
        include: includeTaggings,
      })
    );
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/instance/:id", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const instance = await maybeGetIcon(req.params.id, user.id, {
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

    await validateRequest(req, [checkIconImageUrlIsUrl]);

    const instance = await maybeGetIcon(req.params.id, user.id, {
      include: includeTaggings,
    });

    await instance.update(getIconValues(req));

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

    const instance = await maybeGetIcon(req.params.id, user.id);

    await instance.destroy();

    finishDeleteRequest(res);
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});
