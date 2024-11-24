const { Sequelize } = require('sequelize');
const fs = require("fs");
const path = require("path");
const setupBdd = require("./setupBdd");
const mysql2 = require("mysql2");

const stores = require("../json/testModel/stores.json");
const products = require("../json/testModel/products.json");
const employees = require("../json/testModel/employees.json");


async function main() {
    const sequelize =  setupBdd(true) 
    const models = sequelize.models;

    await dropAllTable();
    await sequelize.sync({force: true});

    const storeService = require("../services/storeService");
    const employeeService = require("../services/employeeService");
    
    for (let s of stores) {
        await storeService.create(s.name, s.address);
    }

    await createProducts(products)

    for (let e of employees) {
        const storesId = ((e.store == -1)? [] : [e.store]);
        await employeeService.create(e.firstname, e.lastname, e.age, e.mail, e.password, e.roles, storesId);
    }

    await sequelize.close();
    console.log("Creation bdd finito");
}


async function createProducts(productsJson) {
    const stockService = require("../services/stockService");
    const productService = require("../services/productService");
    const accessoryService = require("../services/accessoryService");

    for (let p of productsJson) {
        let product = await productService.create(p.ref, p.name, p.unitPrice, p.colors, p.imgPath);

        for (let s of p.stocks) {
            await stockService.setStock(s.store, product.id, s.quantity);
        }

        for (let a of p.accessories) {
            let accessory = await accessoryService.create(a.name, a.price);
            await productService.addAccessory(product.id, accessory.id);
        }
    }
}



async function dropAllTable() {
    const con = mysql2.createConnection({
        host : process.env.DATABASE_HOST,
        user : process.env.DATABASE_USER,
        password : process.env.DATABASE_PASSWORD,
        database : process.env.DATABASE_NAME
    });

    return new Promise((resolve, reject) => {
        con.connect((err) => {
            if (err) throw err;
            const sql = `SELECT table_name FROM information_schema.tables WHERE table_schema = '${process.env.DATABASE_NAME}'`;
            con.query(sql, async (err, res) => {
                if (err) throw err;
                await setForeignKeyChecks(con, 0);
                for (let tableName of res) {
                    await dropTable(con, tableName.TABLE_NAME);
                }
                await setForeignKeyChecks(con, 1);
                con.end();
                resolve();
            });
        });
    });
}


async function dropTable(mysqlCon, tableName) {
    return new Promise((resolve, reject) => {
        const sql = `DROP TABLE IF EXISTS ${tableName}`;
        mysqlCon.query(sql, (err, res) => {
            if (err) throw err;
            resolve();
        });
    });
}

async function setForeignKeyChecks(mysqlCon, v) {
    return new Promise((resolve, reject) => {
        const sql = `SET FOREIGN_KEY_CHECKS=${v}`;
        mysqlCon.query(sql, (err, res) => {
            if (err) throw err;
            resolve();
        });
    });
}

main();
