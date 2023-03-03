const express = require("express");
const iconsRouter = require("./icons");

const router = express.Router();

router.use("/icons", iconsRouter);

module.exports = router;
