const express = require("express");
const router = express.Router();

const { models } = require("../src/sequelizeSetup");

router.get("/all", async (req, res, err) => {
    try {
        const store = await models.Store.findAll();
        res.status(200).json(store);
    } catch(e) {
        res.status(400).json(e);
    }
});


router.post("/create", async (req, res, err) => {
    const body = req.body;

    try {
        await models.Store.create({
            name: body.name,
            adress : body.adress,
        });

        res.sendStatus(201);
    } catch(e) {
        res.status(400).json(e)
    }
});

router.get("/:id", async (req, res, err) => {
    const id = req.params.id;
    try {
        const store = await models.Store.findByPk(id);

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