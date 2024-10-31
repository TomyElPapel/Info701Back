const express = require("express");
const router = express.Router();

const { models } = require("../../src/sequelize");


router.post("/add",  async (req, res, err) => {
    const storeId = req.body.storeId;
    const productId = req.body.productId;
    const value = req.body.value;


    try {
        const stock = await models.Stock.findOne({
            where: {
                StoreId: storeId,
                ProductId: productId
            }
        });

        if (stock) {
            stock.quantity += value;
            await stock.save();

            res.sendStatus(200);
        } else {
            await models.Stock.create({
                StoreId: storeId,
                ProductId: productId,
                quantity: value
            });

            res.sendStatus(201);
        }
    } catch(e) {
        res.status(400).json(e)
    }
});


router.post("/remove",  async (req, res, err) => {
    const storeId = req.body.storeId;
    const productId = req.body.productId;
    const value = req.body.value;


    try {
        const stock = await models.Stock.findOne({
            where: {
                StoreId: storeId,
                ProductId: productId
            }
        });

        if (stock) {
            stock.quantity -= value;

            if (stock.quantity > 0) {
                await stock.save();
            } else {
                await stock.destroy();
            }
            
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch(e) {
        res.status(400).json(e)
    }
});

router.post("/set",  async (req, res, err) => {
    const storeId = req.body.storeId;
    const productId = req.body.productId;
    const value = req.body.value;

    if (value <= 0) {
        res.status(403).json({message : "value cant be 0"});
        return;
    }

    try {
        const stock = await models.Stock.findOne({
            where: {
                StoreId: storeId,
                ProductId: productId
            }
        });

        if (stock) {
            stock.quantity = value;
            await stock.save();

            res.sendStatus(200);
        } else {
            await models.Stock.create({
                StoreId: storeId,
                ProductId: productId,
                quantity: value
            });

            res.sendStatus(201);
        }
    } catch(e) {
        res.status(400).json(e)
    }
});

module.exports = router;