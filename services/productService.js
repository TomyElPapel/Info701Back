const { models } = require("../src/sequelize");
const { Product, Stock, Accessory, Store } = models;


const includeColorsAndAccessory = [
    { model : models.Color, attributes: ["name", "id"] },
    { model : models.Accessory, attributes: ["id", "name", "price"], through : { attributes : []}}
]


const includeAll = [
    { model: models.Stock, attributes: ["StoreId", "quantity"] },
    { model : models.Accessory, attributes: ["id", "name", "price"], through : { attributes : []}},
    { model: models.Color, attributes: ["id", "name"] }
]   


async function findById(productId) {
    const product = await models.Product.findByPk(productId, {
        include: includeAll   
    });

    return product;
}


async function findAll() {
    const products = await models.Product.findAll({
        include: includeColorsAndAccessory
    });

    return products
}

async function findByStore(storeId) {
    const store = await Store.findByPk(storeId, {
        include: {
            model : models.Product,
            include : includeColorsAndAccessory,
            through: {
                attributes: ['quantity'],
            }
        }
    });

    if (store) {
        const products = await store.Products;
        return products;
    } else {
        return null;
    }
}

async function findByStoreAndProduct(productId, storeId) {
    const stock = await Stock.findOne({
        attributes: ["quantity"],
        where: {
            ProductId: productId,
            StoreId: storeId
        },
        include: {
            model: models.Product,
            include: includeColorsAndAccessory
        }
    });

    return stock;
}


async function create(ref, name, unitPrice, colors) {    
    const product = await Product.create({
        ref: ref,
        name : name,
        unitPrice : unitPrice
    });

    for (let c of colors) {
        await product.createColor({
            name: c
        });
    }

    return product;
}

async function addAccessory(productId, accessoryId) {
    const product = await findById(productId);
    const accessory = await Accessory.findByPk(accessoryId);

    if (product && accessory) {
        await product.addAccessory(accessory);
    }
}


module.exports = {
    create,
    findById,
    findAll,
    findByStore,
    findByStoreAndProduct,
    addAccessory,
}