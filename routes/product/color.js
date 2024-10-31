const express = require("express");
const router = express.Router();

const { models } = require("../../src/sequelize");


router.get("/:productId",  async (req, res, err) => {
    const productId = req.params.productId;

    try {
        const product = await models.Product.findByPk(productId, {
            include: {
                model: models.Color,
                attributes: ["name", "id"]
            }
        });
        if (product) {
            const colors = product.Colors;
            res.status(200).json(colors);
        } else {
            res.sendStatus(404);
        }
    } catch(e) {
        console.log(e)
        res.status(400).json(e)
    }
});


router.post("/",  async (req, res, err) => {
    const productId = req.body.productId;
    const name = req.body.name;

    try {
        const product = await models.Product.findByPk(productId);

        if (product) {
            const colors = await product.createColor({
                name: name
            });
            res.status(201).json(colors);
        } else {
            res.sendStatus(404);
        }
    } catch(e) {
        res.status(400).json(e)
    }
});


module.exports = router;