const { models } = require("../src/sequelize");
const { Employee, Store, Role } = models;


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

async function findByRoleAndStore(role, storeId) {
    const store = await Store.findByPk(storeId, {
        include : {
            model: Employee,
            include: {
                model: Role,
                where : {
                    role: role
                }
            }
        }
    });

    return store.Employees;
}


async function findAllRoleByEmployeeId(employeeId) {
    const roles = await Role.findAll({
        where : {
            EmployeeId : employeeId
        },
        attributes : ["role"]
    });

    return roles;
}

module.exports = {
    create,
    findByRoleAndStore,
    findAllRoleByEmployeeId
}