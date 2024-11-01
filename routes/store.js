const express = require("express");
const router = express.Router();

const { findAll, findById } = require("../services/storeService");

router.get("/all", async (req, res, err) => {
    try {
        const stores = await findAll();
        res.status(200).json(stores);
    } catch(e) {
        res.status(400).json(e);
    }
});

router.get("/:id", async (req, res, err) => {
    const id = req.params.id;
    try {
        const store = await findById(id);

        if (store) {
            res.status(200).json(store);
        } else {
            res.sendStatus(404);
        }
        
    } catch(e) {
        res.status(400).json(e)
    }
});

module.exports = router;