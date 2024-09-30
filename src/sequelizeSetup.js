const { Sequelize } = require('sequelize');
const fs = require("fs");
const path = require("path");


const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    logging: (msg) => {},
});

setupEntities("./model/entities", sequelize);
setupEntities("./model/associations", sequelize);

sequelize.sync({ alter: true });


console.log(sequelize.models);


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

module.exports = sequelize;