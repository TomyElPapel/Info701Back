const { models } = require("../src/sequelize");
const { Store, Product, Employee, Role, Stock } = models;



async function findAll() {
    const stores = await Store.findAll();
    return stores;
}


async function findById(storeId) {
    const store = await Store.findByPk(storeId, {
        include: [
            {
                model : Stock,
                attributes: ["quantity"],
                include: {
                    model : Product,
                    attributes: ["id", "name", "ref"],
                }
            },
            {
                model : Employee,
                attributes: ["id","firstname", "lastname", "age"],
                through : { attributes: []},
                include: {
                    model : Role,
                    attributes: ["role"],
                }
            }
        ]
    });
    return store;
}

async function create(name, adress) {
    const store = await Store.create({
        name: name,
        adress : adress,
    });

    return store;
}



module.exports = {
    findAll,
    findById,
    create
}