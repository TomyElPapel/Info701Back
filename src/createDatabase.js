const mysql = require("mysql2");


async function createDatabase() {
    const connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
    });


    await (() => {
        return new Promise((resolve, reject) => {
            connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME}`, (err, results) => {
                if (err) {
                    console.log(err);
                    return reject();
                };
                return resolve(results);
            })
        });
    })();
    
    connection.end();
}

module.exports = createDatabase;