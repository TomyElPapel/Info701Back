const express = require("express");
const router = express.Router();

const { create, finishDelivery, assignTransporterWithDate, validProduct, modifComplet, findByStore, findById, confirmStockForDelivery, completClientDelivery, findByEmployeeWorkplaceAndStat, findWaitTransporter, findByTransporterInDelivery, findFuturDeliveryByTransporter, findTodayDeliveryByTransporter, findTodayDeliveryByWorkplace } = require("../../services/deliveries/clientDeliveryService");
const ClientDeliveryStats = require("../../models/enum/clientDeliveryStats");



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

router.get("/waitingForCommercialManager/:employeeId", async (req, res, err) => {
    const { employeeId } = req.params

    try {
        const deliveries = await findByEmployeeWorkplaceAndStat(employeeId, ClientDeliveryStats.waitingForCommercialManager);
        res.status(200).json(deliveries);
    } catch(e) {
        console.log(e)
        res.status(400).json(e)
    }
});

router.get("/waitingForCompletion/:employeeId", async (req, res, err) => {
    const { employeeId } = req.params

    try {
        const deliveries = await findByEmployeeWorkplaceAndStat(employeeId, ClientDeliveryStats.waitingForCompletion);
        res.status(200).json(deliveries);
    } catch(e) {
        console.log(e)
        res.status(400).json(e)
    }
});

router.get("/waitingForAccessorist/:employeeId", async (req, res, err) => {
    const { employeeId } = req.params

    try {
        const deliveries = await findByEmployeeWorkplaceAndStat(employeeId, ClientDeliveryStats.waitingForAccessorist);
        res.status(200).json(deliveries);
    } catch(e) {
        console.log(e)
        res.status(400).json(e)
    }
});

router.get("/waitingForVerification/:employeeId", async (req, res, err) => {
    const { employeeId } = req.params

    try {
        const deliveries = await findByEmployeeWorkplaceAndStat(employeeId, ClientDeliveryStats.waitingForVerification);
        res.status(200).json(deliveries);
    } catch(e) {
        console.log(e)
        res.status(400).json(e)
    }
});

router.get("/finish/:employeeId", async (req, res, err) => {
    const { employeeId } = req.params

    try {
        const deliveries = await findByEmployeeWorkplaceAndStat(employeeId, ClientDeliveryStats.delivered);
        res.status(200).json(deliveries);
    } catch(e) {
        console.log(e)
        res.status(400).json(e)
    }
});

router.get("/futureDeliveries/byTransporter/:transporterId", async (req, res, err) => {
    const { transporterId } = req.params

    try {
        const deliveries = await findFuturDeliveryByTransporter(transporterId);
        res.status(200).json(deliveries);
    } catch(e) {
        console.log(e)
        res.status(400).json(e)
    }
});


router.get("/todayDeliveries/byTransporter/:transporterId", async (req, res, err) => {
    const { transporterId } = req.params

    try {
        const deliveries = await findTodayDeliveryByTransporter(transporterId);
        res.status(200).json(deliveries);
    } catch(e) {
        console.log(e)
        res.status(400).json(e)
    }
});


router.get("/todayDeliveries/byWorkplace/:employeeId", async (req, res, err) => {
    const { employeeId } = req.params

    try {
        const deliveries = await findTodayDeliveryByWorkplace(employeeId);
        res.status(200).json(deliveries);
    } catch(e) {
        console.log(e)
        res.status(400).json(e)
    }
});


router.get("/waitForTransporter", async (req, res, err) => {
    try {
        const deliveries = await findWaitTransporter();
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