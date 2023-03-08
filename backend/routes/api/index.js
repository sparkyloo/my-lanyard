const express = require("express");

const router = express.Router();

router.use("/cards", require("./cards"));
router.use("/icons", require("./icons"));
router.use("/lanyards", require("./lanyards"));
router.use("/session", require("./session"));
router.use("/tags", require("./tags"));
router.use("/users", require("./users"));

module.exports = router;
