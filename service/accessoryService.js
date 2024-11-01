const { models } = require("../src/sequelize");

const { Accessory, Product } = models;

async function create(name, price) {
    return await Accessory.create({
        name: name,
        price: price,
    });
}


async function findByProduct(productId) {
    const product = await Product.findByPk(productId, {
        include: {
            model: Accessory,
            attributes: ["name", "id", "price"]
        }
    });


    if (product) {
        const accessories = product.Accessories;
        return accessories;
    }

    return null;
}

module.exports = {
    create,
    findByProduct
}