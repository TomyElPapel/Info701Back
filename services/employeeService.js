const { models } = require("../src/sequelize");
const { Employee, Store } = models;


async function create(firstname, lastname, age, mail, password, roles, storesId) {
    const employee = await Employee.create({
        firstname : firstname,
        lastname : lastname,
        age : age,
        mail : mail,
        password : password,
    });

    for (let r of roles) {
        await employee.createRole({
            role: r
        });
    }

    for (let sId of storesId) {
        let store = await Store.findByPk(sId);
        if (store) {
            await store.addEmployee(employee);
        }
    }

    return employee;
}



module.exports = {
    create
}