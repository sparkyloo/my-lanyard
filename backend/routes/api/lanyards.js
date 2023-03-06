const express = require("express");
const { Lanyard } = require("../../db/models");
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

async function maybeGetLanyard(req, res) {
  try {
    const instance = await Lanyard.findByPk(req.params.id);

    if (instance) {
      return instance;
    } else {
      finishNotFound(res, "Lanyard");
    }
  } catch (caught) {
    finishBadRequest(res, caught);
  } finally {
    return null;
  }
}

function getLanyardValues({ body }) {
  const values = {};

  if ("name" in body) {
    values.name = body.name;
  }

  if ("description" in body) {
    values.description = body.description;
  }

  return values;
}

const checkLanyardNameExists = check("name")
  .exists({ checkFalsy: true })
  .withMessage("Lanyards must have a name");

const checkLanyardDescriptionExists = check("description")
  .exists({ checkFalsy: true })
  .withMessage("Lanyard must have a description");

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
