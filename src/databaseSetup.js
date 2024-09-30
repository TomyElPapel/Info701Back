const { Sequelize, DataTypes } = require('sequelize');
const fs = require("fs");
const path = require("path");


module.exports = async (entitiesDirPath) => {
    const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
        host: process.env.DATABASE_HOST,
        dialect: "mysql",
        logging: console.log,
    });

    await setupAllEntities(entitiesDirPath, sequelize);

    await sequelize.sync({ alter: true });

    return sequelize;
}

async function setupAllEntities(entitiesDirPath, sequelize) {
    const files = fs.readdirSync(entitiesDirPath);

    for (let file of files) {
        let filePath = path.join(entitiesDirPath, file);
        let stats = fs.statSync(filePath);
        if (stats.isFile() && file.endsWith(".js")) {
            let entitySetup = await require(filePath);
            await entitySetup(sequelize);
        } else if (stats.isDirectory()) {
            await setupAllEntities(filePath, sequelize);
        }
    };
}