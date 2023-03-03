const express = require("express");
const { Card } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { createTaggingRouter } = require("../../utils/tagging");
const {
  validateRequest,
  finishBadRequest,
  finishNotFound,
} = require("../../utils/validation");

const router = express.Router();

// router.use(requireAuth)

router.use("tagging", createTaggingRouter("cardId"));

async function maybeGetCard(req, res) {
  try {
    const instance = await Card.findByPk(req.params.id);

    if (instance) {
      return instance;
    } else {
      finishNotFound("Card");
    }
  } catch (caught) {
    finishBadRequest(res, caught);
  } finally {
    return null;
  }
}

function getCardValues({ body }) {
  const values = {};

  if ("text" in body) {
    values.text = body.text;
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
