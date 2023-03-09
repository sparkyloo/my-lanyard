const express = require("express");
const { check } = require("express-validator");
const { Tag } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
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

module.exports.maybeGetTag = maybeGetTag;

async function maybeGetTag(req, authorId, options = {}) {
  const instance = await Tag.findByPk(req.params.id, options);

  if (instance) {
    if (!!authorId && authorId !== instance.authorId) {
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

const checkTagNameExists = check("name")
  .exists({ checkFalsy: true })
  .withMessage("Icons must have a name");

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

    const instance = await maybeGetTag(req, user.id);

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

    const instance = await maybeGetTag(req, user.id);

    await instance.update(getTagValues(req));

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

    const instance = await maybeGetTag(req, user.id);

    await instance.destroy();

    finishDeleteRequest(res);
  } catch (caught) {
    finishBadRequest(caught);
  }
});
