const express = require("express");
const router = express.Router();

const { findByProduct } = require("../../services/accessoryService");


router.get("/:productId",  async (req, res, err) => {
    const productId = req.params.productId;

    try {
        const accessories = await findByProduct(productId);
        res.status(200).json(accessories);
    } catch(e) {
        console.log(e)
        res.status(400).json(e)
    }
});


module.exports = router;