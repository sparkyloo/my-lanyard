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
      finishNotFound("Tag");
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
  res.status(500);
  res.end("unimplemented");
});

/**
 * read
 */
router.get("/", async (req, res) => {
  res.status(500);
  res.end("unimplemented");
});

router.get("/:id", async (req, res) => {
  res.status(500);
  res.end("unimplemented");
});

/**
 * update
 */
router.patch("/:id", async (req, res) => {
  res.status(500);
  res.end("unimplemented");
});

/**
 * delete
 */
router.delete("/:id", async (req, res) => {
  res.status(500);
  res.end("unimplemented");
});

module.exports = router;
