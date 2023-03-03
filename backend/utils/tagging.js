const express = require("express");
const { Tag, Tagging } = require("../../db/models");

function createTaggingRouter(foriegnKey) {
  const router = express.Router();

  /**
   * create
   */
  router.post("/:id", async (req, res) => {
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
   * delete
   */
  router.delete("/:id", async (req, res) => {
    res.status(500);
    res.end("unimplemented");
  });

  return router;
}

module.exports = {
  createTaggingRouter,
};
