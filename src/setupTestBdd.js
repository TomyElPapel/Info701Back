const { Sequelize } = require('sequelize');
const fs = require("fs");
const path = require("path");
const setupBdd = require("./setupBdd");

const stores = require("../json/testModel/stores.json");
const products = require("../json/testModel/products.json");
const employees = require("../json/testModel/employees.json");


async function main() {
    const sequelize =  setupBdd(true)
    const models = sequelize.models;

    await sequelize.sync({force: true});
    
    for (let s of stores) {
        await models.Store.create({
            name : s.name,
            adress : s.address
        });
    }

    await createProducts(products)

    for (let e of employees) {

    }

    await sequelize.close();
    console.log("Creation bdd finito");
}


async function createProducts(productsJson) {
    const stockService = require("../service/stockService");
    const productService = require("../service/productService");
    const accessoryService = require("../service/accessoryService");

    for (let p of productsJson) {
        let product = await productService.create(p.ref, p.name, p.unitPrice, p.colors)

        for (let s of p.stocks) {
            await stockService.setStock(s.store, product.id, s.quantity);
        }

        for (let a of p.accessories) {
            let accessory = await accessoryService.create(a.name, a.price);
            await productService.addAccessory(product.id, accessory.id);
        }
    }
}



main();
