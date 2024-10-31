const { Sequelize } = require('sequelize');
const fs = require("fs");
const path = require("path");
const createDatabase = require("./createDatabase");

async function setupSequilize(reset=false) {
    await createDatabase();

    const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        dialect: "mysql",
        logging: (msg) => {},
    });

    setupEntities("./model/entities", sequelize);
    setupEntities("./model/associations", sequelize);
    setupEntities("./model/deliveries",sequelize);

    if (reset) {
        await sequelize.sync({ force: true });
    } else {
        await sequelize.sync({ alter: true });
    }

    return sequelize;
}

function setupEntities(entitiesDirPath, sequelize) {
    const files = fs.readdirSync(entitiesDirPath);

    for (let file of files) {
        let filePath = path.join(entitiesDirPath, file);
        let stats = fs.statSync(filePath);
        if (stats.isFile() && file.endsWith(".js")) {
            let entitySetup = require("../" + filePath);
            entitySetup(sequelize);
        } else if (stats.isDirectory()) {
            setupEntities(filePath, sequelize);
        }
    };
}


module.exports = setupSequilize;