const express = require("express");
const router = express.Router();

const { create, findByEmployee } = require("../../services/notifications/clientDeliveryNotificationService");




router.get("/delivery/client/all/:employeeId", async (req, res, err) => {
    const { employeeId } = req.params

    try {
        const notifs = await findByEmployee(employeeId);
        res.status(200).json(notifs);
    } catch(e) {
        console.log(e)

        res.status(400).json(e)
    }
});



module.exports = router;