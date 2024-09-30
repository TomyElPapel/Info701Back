const express = require("express");
const path = require("path");
const routerSetup = require("./src/routerSetup");
const sequelizeSetup = require("./src/databaseSetup");


const app = express();
const port = process.env.PORT;

const routesDir = path.join(__dirname, "routes");
const entitiesDir = path.join(__dirname, "entities");

const sequelize = sequelizeSetup(entitiesDir);
routerSetup(routesDir, app, "/api/");

app.get("/", (req, res, err) => {
    res.send("main");
});

app.listen(port, () => {
    console.log("server up on port : " + port);
});


