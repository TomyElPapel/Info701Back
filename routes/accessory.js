const express = require("express");
const router = express.Router();

const { models } = require("../src/sequelize");


router.post("/",  async (req, res, err) => {
    const name = req.body.name;
    const price = req.body.price;

    try {
        await models.Accessory.create({
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