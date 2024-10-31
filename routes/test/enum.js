const express = require("express");
const router = express.Router();

const NotificationStatus = require("../../model/enum/notifactionStatus")

router.get("/", async (req, res, err) => {
    console.log(NotificationStatus.All);

    res.json(NotificationStatus.All);
});

module.exports = router;