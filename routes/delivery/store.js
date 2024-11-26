const express = require("express");
const router = express.Router();

const { create, findAll, findById, assignDeliveryStore, assignTransporter, confirmDelivery} = require("../../services/deliveries/storeDeliveryService")



router.post("/",  async (req, res, err) => {
    const {
        storeId,
        productId,
        creatorId
    } = req.body;

    try {
        const d = await create(storeId, creatorId, productId);
        const delivery = await findById(d.id);
        res.status(201).json(delivery);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.get("/all", async (req, res, err) => {
    try {
        const deliveries = await findAll();
        res.status(200).json(deliveries);
    } catch(e) {
        console.log(e)

        res.status(400).json(e)
    }
});

router.get("/:deliveryId", async (req, res, err) => {
    const {deliveryId} = req.params;

    try {
        const delivery = await findById(deliveryId);

        if (delivery) {
            res.status(200).json(delivery);
        } else {
            res.status(404).json({msg: "no delivery with id"})
        }
    } catch(e) {
        console.log(e)

        res.status(400).json(e)
    }
});

router.post("/assignStore", async (req, res, err) => {
    const {
        storeId,
        deliveryId,
    } = req.body;

    try {
        const delivery = await assignDeliveryStore(deliveryId, storeId);
        res.status(200).json(delivery);
    } catch(e) {
        res.status(400).json(e)
    }
});


router.post("/assignTransporter", async (req, res, err) => {
    const {
        transporterId,
        deliveryId,
        deliveryDate
    } = req.body;

    try {
        const delivery = await assignTransporter(deliveryId, transporterId, deliveryDate);
        res.status(200).json(delivery);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.post("/confirmDelivery", async (req, res, err) => {
    const {
        deliveryId,
    } = req.body;

    try {
        const delivery = await confirmDelivery(deliveryId);
        res.status(200).json(delivery);
    } catch(e) {
        res.status(400).json(e)
    }
});


module.exports = router;