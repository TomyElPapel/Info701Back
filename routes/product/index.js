const express = require("express");
const router = express.Router();

const { models } = require("../../src/sequelizeSetup");

router.get("/all", async (req, res, err) => {
    try {
        const products = await models.Product.findAll();
        res.status(200).json(products);
    } catch(e) {
        res.status(400).json(e);
    }
});


router.post("/create", async (req, res, err) => {
    const body = req.body;

    try {
        await models.Product.create({
            ref: body.ref,
            name : body.name,
            unitPrice : body.unitPrice
        });

        res.sendStatus(201);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.get("/all/:storeId", async (req, res, err) => {
    const storeId = req.params.storeId;

    try {
        const store = await models.Store.findByPk(storeId, {
            include: models.Product
        });

        const products = await store.getProducts({ joinTableAttributes: ["quantity"] });

        res.status(200).json(products);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.get("/:productId", async (req, res, err) => {
    const storeId = req.params.storeId;

    try {
        const store = await models.Product.findByPk(storeId, {
            include: models.Product
        });

        const products = await store.getProducts({ joinTableAttributes: ["quantity"] });

        res.status(200).json(products);
    } catch(e) {
        res.status(400).json(e)
    }
});

module.exports = router;