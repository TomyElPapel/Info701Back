const workplace = require("../models/associations/workplace");
const { models } = require("../src/sequelize");
const { Employee, Store, Role, WorkPlace } = models;


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


async function findEmployeeByMailAndPassword(mail, password) {
    const e = await Employee.findOne({
        where : {
            mail: mail,
            password: password
        },
        include: [{
                model : Role,
                attributes: ["role"],
            },{
                model : WorkPlace,
                include: {
                    model: Store,
                    attributes: ["id", "name", "adress"]
                }
            }
        ]
    })

    const employee = {
        id: e.id,
        firstname: e.firstname,
        lastname: e.lastname,
        age: e.age,
        mail: e.mail,
        Roles: [],
        Stores: []
    }

    for (let r of e.Roles) {
        employee.Roles.push(r.role);
    }

    for (let s of e.Stores) {
        employee.Stores.push(s.Store);
    }

    return employee;
}

module.exports = {
    findEmployeeByMailAndPassword,
    create,
    findByRoleAndStore,
    findAllRoleByEmployeeId
}