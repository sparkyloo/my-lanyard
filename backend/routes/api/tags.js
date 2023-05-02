const express = require("express");
const { Tag } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { notAllowed, notFound } = require("../../utils/errors");
const { userCanViewItem, byUserOrSystem } = require("../../utils/misc");
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
    const user = await requireAuth(req, res);

    finishGetRequest(
      res,
      await Tag.findAll({
        where: {
          authorId: byUserOrSystem(user.id),
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
