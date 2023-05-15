const express = require("express");
const { Tag } = require("../../db/models");
const { requireAuth, restoreUser } = require("../../utils/auth");
const { notAllowed, notFound, conflict } = require("../../utils/errors");
const { userCanViewItem, byUserOrSystem, inList } = require("../../utils/misc");
const {
  createRequiredCheck,
  validateRequest,
  finishBadRequest,
  finishPostRequest,
  finishGetRequest,
  finishPatchRequest,
  finishDeleteRequest,
} = require("../../utils/validation");

const router = express.Router();

module.exports = router;

module.exports.maybeGetTag = maybeGetTag;
module.exports.maybeGetManyTags = maybeGetManyTags;

async function maybeGetTag(instanceId, userId, options = {}) {
  const instance = await Tag.findByPk(instanceId, options);

  if (instance) {
    if (!userCanViewItem(userId, instance.authorId)) {
      throw notAllowed();
    }

    return instance;
  } else {
    throw notFound("Tag");
  }
}

async function maybeGetManyTags(instanceIds, userId, options = {}) {
  const instances = await Tag.findAll({
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
    throw notFound("Tag");
  } else {
    return instances;
  }
}

function getTagValues({ body }) {
  const values = {};

  if ("name" in body) {
    values.name = body.name;
  }

  return values;
}

const checkTagNameExists = createRequiredCheck("Name", (body) => body.name);

/**
 * create
 */
router.post("/", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const { name } = await validateRequest(req, [checkTagNameExists]);

    const existing = await Tag.findOne({
      where: {
        name,
        authorId: user.id,
      },
    });

    if (existing) {
      throw conflict(name);
    }

    finishPostRequest(
      res,
      await Tag.create({
        name,
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
      await Tag.findAll({
        where: {
          authorId: byUserOrSystem(user?.id),
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

    const instance = await maybeGetTag(req.params.id, user.id);

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

    await validateRequest(req, [checkTagNameExists]);

    const instance = await maybeGetTag(req.params.id, user.id);

    await instance.update(getTagValues(req));

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

    const instance = await maybeGetTag(req.params.id, user.id);

    await instance.destroy();

    finishDeleteRequest(res);
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});
