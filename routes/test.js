const express = require("express");
const router = express.Router();

router.get("/", (req, res, err) => {
    console.log("test");
    res.send("test ok");
});

module.exports = router;