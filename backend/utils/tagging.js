const { Tagging } = require("../db/models");
const { requireAuth } = require("../utils/auth");
const { maybeGetTag } = require("../routes/api/tags");
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

const checkTaggingInstanceIdExists = createRequiredCheck(
  "Instance ID",
  (body) => body.instanceId
);

function addTaggingRoutes(router, foriegnKey, maybeGetInstance) {
  /**
   * create
   */
  router.post("/tagging/:id", async (req, res) => {
    try {
      const user = await requireAuth(req, res);

      const { instanceId } = validateRequest(req, [
        checkTaggingInstanceIdExists,
      ]);

      const [tag] = await Promise.all([
        maybeGetTag(req.params.id, user.id),
        maybeGetInstance(instanceId, user.id),
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
