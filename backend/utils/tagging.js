const express = require("express");
const { check } = require("express-validator");
const { Card, Icon, Lanyard, Tag, Tagging } = require("../db/models");
const { requireAuth } = require("../utils/auth");
const { maybeGetTag } = require("../routes/api/tags");
const { notAllowed, notFound } = require("../utils/errors");
const {
  validateRequest,
  finishBadRequest,
  finishPostRequest,
  finishGetRequest,
  finishDeleteRequest,
} = require("../utils/validation");

async function maybeGetTagging(req, authorId) {
  const instance = await Tagging.findByPk(req.params.id, {
    include: ["card", "icon", "lanyard", "tag"],
  });

  if (instance) {
    if (typeof authorId !== "undefined" && authorId !== instance.authorId) {
      throw notAllowed();
    }

    return instance;
  } else {
    throw notFound("Tagging");
  }
}

const checkTaggingInstanceIdExists = check("instanceId")
  .exists({ checkFalsy: true })
  .withMessage("Tagging request must have an instanceId");

function addTaggingRoutes(router, foriegnKey, maybeGetInstance) {
  /**
   * create
   */
  router.post("/tagging/:id", async (req, res) => {
    try {
      const user = await requireAuth(req, res);

      const { instanceId } = await validateRequest(req, [
        checkTaggingInstanceIdExists,
      ]);

      const [tag] = await Promise.all([
        maybeGetTag(req, user.id),
        maybeGetInstance({ params: { id: instanceId } }, user.id),
      ]);

      finishPostRequest(
        res,
        await Tagging.create({
          tagId: tag.id,
          authorId: user.id,
          [foriegnKey]: instanceId,
        })
      );
    } catch (caught) {
      finishBadRequest(res, caught);
    }
  });

  /**
   * read
   */
  router.get("/taggings", async (req, res) => {
    try {
      const user = await requireAuth(req, res);

      finishGetRequest(
        res,
        await Tagging.findAll({
          where: {
            authorId: user.id,
          },
        })
      );
    } catch (caught) {
      finishBadRequest(res, caught);
    }
  });

  router.get("/tagging/:id", async (req, res) => {
    try {
      const user = await requireAuth(req, res);

      const instance = await maybeGetTagging(req, user.id);

      finishGetRequest(res, instance);
    } catch (caught) {
      finishBadRequest(res, caught);
    }
  });

  router.get("/instance/:id/taggings", async (req, res) => {
    try {
      const user = await requireAuth(req, res);

      const instance = await maybeGetInstance(req, user.id, {
        include: {
          as: "taggings",
          model: Tagging,
          include: "tag",
        },
      });

      finishGetRequest(res, instance);
    } catch (caught) {
      finishBadRequest(res, caught);
    }
  });

  /**
   * delete
   */
  router.delete("/tagging/:id", async (req, res) => {
    try {
      const user = await requireAuth(req, res);

      const instance = await maybeGetTagging(req, user.id);

      await instance.destroy();

      finishDeleteRequest(res);
    } catch (caught) {
      finishBadRequest(caught);
    }
  });

  return router;
}

module.exports = {
  addTaggingRoutes,
};
