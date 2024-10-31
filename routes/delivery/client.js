const express = require("express");
const router = express.Router();

const { models } = require("../src/sequelizeSetup");


router.post("/",  async (req, res, err) => {
    const productId = req.body.productId;
    const storeId = req.body.storeId;
    const clientFirstName = req.body.clientFirstName;
    const clientLastName = req.body.clientLastName;
    const employeeId = req.body.employeeId;

    try {
        await models.Client_Delivery.create({
            name: name,
            price: price
        });

        res.sendStatus(201);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.get("/all", async (req, res, err) => {
    try {
        const accessories = await models.Accessory.findAll();
        res.status(200).json(accessories);
    } catch(e) {
        console.log(e)

        res.status(400).json(e)
    }
});

router.get("/:id",  async (req, res, err) => {
    const id = req.params.id;

    try {
        const accessory = await models.Accessory.findByPk(id);

        if (accessory) {
            res.status(200).json(accessory);
        } else {
            res.sendStatus(404);
        }
    } catch(e) {
        res.status(400).json(e)
    }
});


module.exports = router;