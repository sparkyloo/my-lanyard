const express = require("express");
const { Icon, Card, Lanyard, Tag, Tagging } = require("../../db/models");
const { maybeGetCard } = require("./cards");
const { maybeGetIcon } = require("./icons");
const { maybeGetLanyard } = require("./lanyards");
const { maybeGetTag } = require("./tags");
const {
  finishBadRequest,
  finishGetRequest,
} = require("../../utils/validation");

const router = express.Router();

async function getAll(Model) {
  return Model.findAll({
    where: {
      authorId: 1,
    },
  });
}

async function getDataWithTags(req, getter) {
  return getter(req, 1, {
    include: {
      as: "taggings",
      model: Tagging,
      include: "tag",
    },
  });
}

router.get("/icons", async (_req, res) => {
  try {
    finishGetRequest(res, await getAll(Icon));
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/icons/instance/:id", async (req, res) => {
  try {
    finishGetRequest(res, await getDataWithTags(req, maybeGetIcon));
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/cards", async (_req, res) => {
  try {
    finishGetRequest(res, await getAll(Card));
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/cards/instance/:id", async (req, res) => {
  try {
    finishGetRequest(res, await getDataWithTags(req, maybeGetCard));
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/lanyards", async (_req, res) => {
  try {
    finishGetRequest(res, await getAll(Lanyard));
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/lanyards/instance/:id", async (req, res) => {
  try {
    finishGetRequest(res, await getDataWithTags(req, maybeGetLanyard));
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/tags", async (_req, res) => {
  try {
    finishGetRequest(res, await getAll(Tag));
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

router.get("/tags/instance/:id", async (req, res) => {
  try {
    finishGetRequest(res, await maybeGetTag(req, 1));
  } catch (caught) {
    finishBadRequest(res, caught);
  }
});

module.exports = router;
