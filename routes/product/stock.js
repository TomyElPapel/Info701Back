const express = require("express");
const router = express.Router();

const { addStock, removeStock, setStock } = require("../../services/stockService")


router.post("/add",  async (req, res, err) => {
    const storeId = req.body.storeId;
    const productId = req.body.productId;
    const value = req.body.value;

    if (value <= 0) {
        res.status(403).json({message : "value cant be negative"});
        return;
    }

    try {
        await addStock(storeId, productId, value)
        res.sendStatus(200);
    } catch(e) {
        res.status(400).json(e)
    }
});


router.post("/remove",  async (req, res, err) => {
    const storeId = req.body.storeId;
    const productId = req.body.productId;
    const value = req.body.value;

    if (value <= 0) {
        res.status(403).json({message : "value cant be negative"});
        return;
    }

    try {
        await removeStock(storeId, productId, value);
        res.sendStatus(200);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.post("/set",  async (req, res, err) => {
    const storeId = req.body.storeId;
    const productId = req.body.productId;
    const value = req.body.value;

    if (value <= 0) {
        res.status(403).json({message : "value cant be negative"});
        return;
    }

    try {
        await setStock(storeId, productId, value);
        res.sendStatus(200);
    } catch(e) {
        res.status(400).json(e)
    }
});

module.exports = router;