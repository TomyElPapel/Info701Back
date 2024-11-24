const { models } = require("../src/sequelize");
const { Product, Stock, Accessory, Store, Color } = models;


const includeColorsAndAccessory = [
    { model : Color, attributes: ["name", "id", "display"] },
    { model : Accessory, attributes: ["id", "name", "price"], through : { attributes : []}}
]


const includeAll = [
    { model: Stock, attributes: ["StoreId", "quantity"] },
    { model : Accessory, attributes: ["id", "name", "price"], through : { attributes : []}},
    { model: Color, attributes: ["id", "name", "display"] }
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


async function create(ref, name, unitPrice, colors, imgPath) {    
    const product = await Product.create({
        ref: ref,
        name : name,
        unitPrice : unitPrice,
        imgPath : imgPath
    });

    for (let c of colors) {
        await product.createColor({
            name: c.name,
            display: c.display
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