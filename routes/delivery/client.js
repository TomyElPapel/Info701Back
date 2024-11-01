const express = require("express");
const router = express.Router();

const { create, findByStore } = require("../../services/deliveries/clientDeliveryService")



router.post("/",  async (req, res, err) => {
    const {
        clientFirstName,
        clientLastName,
        adress,
        storeId,
        productId,
        colorId,
        accessoryId,
        creatorId
    } = req.body;

    try {
        await create(clientFirstName, clientLastName, adress, storeId, productId, colorId, accessoryId, creatorId);
        res.sendStatus(201);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.get("/all/:storeId", async (req, res, err) => {
    const { storeId } = req.params

    try {
        const deliveries = await findByStore(storeId);
        res.status(200).json(deliveries);
    } catch(e) {
        console.log(e)

        res.status(400).json(e)
    }
});



module.exports = router;