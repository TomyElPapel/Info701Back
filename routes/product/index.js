const express = require("express");
const router = express.Router();

const { models } = require("../../src/sequelizeSetup");

router.get("/all", async (req, res, err) => {
    try {
        const products = await models.Product.findAll({
            include: [
                { model : models.Color, attributes: ["name", "id"] },
                { model : models.Accessory, attributes: ["id", "name", "price"] }
            ]
        });
        res.status(200).json(products);
    } catch(e) {
        res.status(400).json(e);
    }
});


router.post("/", async (req, res, err) => {
    const ref = req.body.ref;
    const name = req.body.name;
    const unitPrice = req.body.unitPrice;

    const colors = req.body.colors;

    try {
        const product = await models.Product.create({
            ref: ref,
            name : name,
            unitPrice : unitPrice
        });

        if (colors) {
            for (let name of colors) {
                await product.createColor({
                    name: name
                })
            }
        }

        res.sendStatus(201);
    } catch(e) {
        res.status(400).json(e);
    }
});

router.get("/all/:storeId", async (req, res, err) => {
    const storeId = req.params.storeId;

    try {
        const store = await models.Store.findByPk(storeId, {
            include: {
                model : models.Product,
                through: {
                    attributes: ['quantity'],
                }
            }
        });

        const products = await store.Products;

        res.status(200).json(products);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.get("/:storeId/:productId", async (req, res, err) => {
    const productId = req.params.productId;
    const storeId = req.params.storeId;

    try {
        const stock = await models.Stock.findOne({
            attributes: ["quantity"],
            where: {
                ProductId: productId,
                StoreId: storeId
            },
            include: {
                model: models.Product,
                include: [
                    {
                        model: models.Accessory,
                        attributes: ["name", "id", "price"]
                    },
                    {
                        model: models.Color,
                        attributes: ["id", "name"]
                    }
                ]
            }
        });

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
        const product = await models.Product.findByPk(productId, {
            include: [
                {
                    model: models.Stock,
                    attributes: ["StoreId", "quantity"]
                },
                {
                    model: models.Accessory,
                    attributes: ["name", "id", "price"]
                },
                {
                    model: models.Color,
                    attributes: ["id", "name"]
                }
            ]     
        });

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