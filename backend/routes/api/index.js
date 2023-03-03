const express = require("express");
const sessionRouter = require("./session");
const iconsRouter = require("./icons");
const usersRouter = require("./users");

const router = express.Router();

router.use("/session", sessionRouter);
router.use("/icons", iconsRouter);
router.use("/users", usersRouter);

module.exports = router;
