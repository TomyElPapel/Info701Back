const express = require("express");
const router = express.Router();

const sequelize = require("../src/sequelizeSetup");

router.get("/", async (req, res, err) => {
    const User = sequelize.models.User;

    const users = await User.findAll();

    res.send(users);
});


router.post("/", async (req, res, err) => {
    const name = req.body.name;
    const age = req.body.age;

    const User = sequelize.models.User;
    await User.create({name: name, age: age});

    res.sendStatus(200);
});

module.exports = router;