const express = require("express");
const { check } = require("express-validator");
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

// TODO: update to match maybeGetIcon
async function maybeGetCard(req, res) {
  try {
    const instance = await Card.findByPk(req.params.id);

    if (instance) {
      return instance;
    } else {
      finishNotFound(res, "Card");
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

const checkCardTextIsString = check("text")
  .isString()
  .withMessage("Card text must be a string");

/**
 * create
 */
router.post("/", async (req, res) => {
  try {
    const user = await requireAuth(req, res);

    const { text } = await validateRequest(req, [checkCardTextIsString]);

    const card = await Card.create({
      authorId: user.id,
      text,
    });

    res.status(201);
    res.json(card);
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
