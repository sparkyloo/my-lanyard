const { Tagging } = require("../db/models");
const { requireAuth } = require("../utils/auth");
const { maybeGetManyTags } = require("../routes/api/tags");
const { notAllowed, notFound } = require("../utils/errors");
const {
  createRequiredCheck,
  validateRequest,
  finishBadRequest,
  finishPostRequest,
  finishGetRequest,
  finishDeleteRequest,
} = require("../utils/validation");

const includeTaggings = {
  as: "taggings",
  model: Tagging,
  include: "tag",
};

async function getDataWithTags(req, getter, authorId) {
  return getter(req, authorId, {
    include: includeTaggings,
  });
}

async function maybeGetTagging(tagId, userId) {
  const instance = await Tagging.findByPk(tagId, {
    include: ["card", "icon", "lanyard", "tag"],
  });

  if (instance) {
    if (!userCanViewItem(userId, instance.authorId)) {
      throw notAllowed();
    }

    return instance;
  } else {
    throw notFound("Tagging");
  }
}

const checkTaggingTagIdsToAddExists = createRequiredCheck(
  "Tag IDs to add",
  (body) => body.toAdd
);

const checkTaggingTagIdsToRemoveExists = createRequiredCheck(
  "Tag IDs to remove",
  (body) => body.toRemove
);

const checkTaggingInstanceIdExists = createRequiredCheck(
  "Instance ID",
  (body) => body.instanceId
);

function addTaggingRoutes(
  router,
  foriegnKey,
  maybeGetInstance,
  maybeGetManyInstances
) {
  /**
   * create
   */
  router.post("/tagging", async (req, res) => {
    try {
      const user = await requireAuth(req, res);

      const { toAdd, toRemove, instanceId } = validateRequest(req, [
        checkTaggingTagIdsToAddExists,
        checkTaggingTagIdsToRemoveExists,
        checkTaggingInstanceIdExists,
      ]);

      await Promise.all([
        maybeGetManyTags(toAdd, user.id),
        maybeGetInstance(instanceId, user.id),
        maybeGetManyTags(toRemove, user.id),
      ]);

      await Tagging.destroy({
        where: {
          [foriegnKey]: instanceId,
          tagId: toRemove,
          authorId: user.id,
        },
      });

      finishPostRequest(res, {
        added: await Tagging.bulkCreate(
          toAdd.map((tagId) => ({
            tagId,
            authorId: user.id,
            [foriegnKey]: instanceId,
          })),
          {
            include: "tag",
          }
        ),
        removed: toRemove,
      });
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

      const instance = await maybeGetTagging(req.params.id, user.id);

      finishGetRequest(res, instance);
    } catch (caught) {
      finishBadRequest(res, caught);
    }
  });

  router.get("/instance/:id/taggings", async (req, res) => {
    try {
      const user = await requireAuth(req, res);

      const instance = await maybeGetInstance(req.params.id, user.id, {
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

      const instance = await maybeGetTagging(req.params.id, user.id);

      await instance.destroy();

      finishDeleteRequest(res);
    } catch (caught) {
      finishBadRequest(caught);
    }
  });

  return router;
}

module.exports = {
  includeTaggings,
  getDataWithTags,
  addTaggingRoutes,
};
