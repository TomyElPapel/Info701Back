const express = require("express");
const path = require("path");
const routerSetup = require("./src/routerSetup");
const sequelize = require("./src/sequelize");

(async () => {

    const app = express();
    app.use(express.json());

    const port = process.env.PORT;
    const routesDir = path.join(__dirname, "routes");
    
    await routerSetup(routesDir, app, "/api/");

    app.get("/", (req, res, err) => {
        res.send("main");
    });

    app.listen(port, () => {
        console.log("server up on port : " + port);
    });
})();


