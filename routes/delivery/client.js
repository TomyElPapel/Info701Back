const express = require("express");
const router = express.Router();

const { create, finishDelivery, assignTransporterWithDate, validProduct, modifComplet, findByStore, findById, confirmStockForDelivery, completClientDelivery } = require("../../services/deliveries/clientDeliveryService")



router.post("/",  async (req, res, err) => {
    const {
        clientFirstName,
        clientLastName,
        adress,
        storeId,
        productId,
        colorId,
        accessoryId,
        creatorId,
        description,
    } = req.body;

    try {
        const delivery = await create(clientFirstName, clientLastName, adress, description, storeId, productId, colorId, accessoryId, creatorId);
        res.status(201).json(delivery);
    } catch(e) {
        res.status(400).json(e)
    }
});


router.post("/confirmStock", async (req, res, err) => {
    const {
        deliveryId,
        enoughStock,
    } = req.body;

    try {
        const delivery = await confirmStockForDelivery(deliveryId, enoughStock);
        res.status(200).json(delivery);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.post("/complet", async (req, res, err) => {
    const {
        deliveryId,
        needModification,
        modificationNotes
    } = req.body;

    try {
        const delivery = await completClientDelivery(deliveryId, needModification, modificationNotes);
        res.status(200).json(delivery);
    } catch(e) {
        res.status(400).json(e)
    }
});


router.post("/modifComplet", async (req, res, err) => {
    const {
        deliveryId,
    } = req.body;

    try {
        const delivery = await modifComplet(deliveryId);
        res.status(200).json(delivery);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.post("/valid", async (req, res, err) => {
    const {
        deliveryId,
    } = req.body;

    try {
        const delivery = await validProduct(deliveryId);
        res.status(200).json(delivery);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.post("/assignTransporter", async (req, res, err) => {
    const {
        deliveryId,
        transporterId,
        date
    } = req.body;

    try {
        const delivery = await assignTransporterWithDate(deliveryId, transporterId, date);
        res.status(200).json(delivery);
    } catch(e) {
        res.status(400).json(e)
    }
});


router.post("/finish", async (req, res, err) => {
    const {
        deliveryId,
    } = req.body;

    try {
        const delivery = await finishDelivery(deliveryId);
        res.status(200).json(delivery);
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


router.get("/:deliveryId", async (req,res,err) => {
    const { deliveryId } = req.params;

    try {
        const delivery = await findById(deliveryId);
        
        if (delivery) {
            res.status(200).json(delivery);
        } else {
            res.sendStatus(404);
        }

    } catch(e) {
        console.log(e)

        res.status(400).json(e)
    }
});



module.exports = router;