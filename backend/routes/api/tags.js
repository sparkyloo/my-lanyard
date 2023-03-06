const express = require("express");
const { Tag } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const {
  validateRequest,
  finishBadRequest,
  finishNotFound,
} = require("../../utils/validation");

const router = express.Router();

// router.use(requireAuth)

async function maybeGetTag(req, res) {
  try {
    const instance = await Tag.findByPk(req.params.id);

    if (instance) {
      return instance;
    } else {
      finishNotFound(res, "Tag");
    }
  } catch (caught) {
    finishBadRequest(res, caught);
  } finally {
    return null;
  }
}

function getTagValues({ body }) {
  const values = {};

  if ("name" in body) {
    values.name = body.name;
  }

  return values;
}

/**
 * create
 */
router.post("/", async (req, res) => {
  try {
    await requireAuth(req, res);
    res.status(500);
    res.end("unimplemented");
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

/**
 * read
 */
router.get("/", async (req, res) => {
  try {
    await requireAuth(req, res);
    res.status(500);
    res.end("unimplemented");
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/:id", async (req, res) => {
  try {
    await requireAuth(req, res);
    res.status(500);
    res.end("unimplemented");
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

/**
 * update
 */
router.patch("/:id", async (req, res) => {
  try {
    await requireAuth(req, res);
    res.status(500);
    res.end("unimplemented");
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

/**
 * delete
 */
router.delete("/:id", async (req, res) => {
  try {
    await requireAuth(req, res);
    res.status(500);
    res.end("unimplemented");
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

module.exports = router;
