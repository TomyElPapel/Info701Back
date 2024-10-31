const setupBdd = require("./setupBdd");

const sequelize = setupBdd();

module.exports = sequelize;