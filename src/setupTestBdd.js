const { Sequelize } = require('sequelize');
const fs = require("fs");
const path = require("path");
const setupBdd = require("./setupBdd");

setupBdd(true);


console.log("Creation bdd finito");