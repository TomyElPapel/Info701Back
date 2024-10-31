const express = require("express");
const router = express.Router();

const productService = require("../../service/productService");

router.get("/all", async (req, res, err) => {
    try {
        const products = await productService.findAll();
        res.status(200).json(products);
    } catch(e) {
        res.status(400).json(e);
    }
});


router.post("/", async (req, res, err) => {
    const ref = req.body.ref;
    const name = req.body.name;
    const unitPrice = req.body.unitPrice;

    const colors = (req.body.colors ? req.body.colors : []);

    try {
        const product = await productService.create(ref, name, unitPrice, colors);
        res.send(201).json(product);
    } catch(e) {
        res.status(400).json(e);
    }
});

router.get("/all/:storeId", async (req, res, err) => {
    const storeId = req.params.storeId;

    try {
        const products = await productService.findByStore(storeId)

        res.status(200).json(products);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.get("/:storeId/:productId", async (req, res, err) => {
    const productId = req.params.productId;
    const storeId = req.params.storeId;

    try {
        const stock = await productService.findByStoreAndProduct(productId, storeId);
        if (stock) {
            res.status(200).json(stock);
        } else  {
            res.status(404).json({message : `no stock with productid ${productId} and storeid ${storeId}`})
        }
    } catch(e) {
        res.status(400).json(e)
    }
});

router.get("/:productId", async (req, res, err) => {
    const productId = req.params.productId;

    try {
        const product = await productService.findById(productId);

        if (product) {
            res.status(200).json(product);
        } else  {
            res.status(404).json({message : `no product with id ${productId}`})
        }
        
    } catch(e) {
        res.status(400).json(e)
    }
});


module.exports = router;