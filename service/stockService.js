const { models } = require("../src/sequelize");

const Stock = models.Stock;

async function addStock(storeId, productId, quantity) {
    const stock = await Stock.findOne({
        where: {
            StoreId: storeId,
            ProductId: productId
        }
    });

    if (stock) {
        stock.quantity += quantity;
        await stock.save();
    } else {
        await Stock.create({
            StoreId: storeId,
            ProductId: productId,
            quantity: quantity
        });
    }
}


async function removeStock(storeId, productId, quantity) {
    const stock = await Stock.findOne({
        where: {
            StoreId: storeId,
            ProductId: productId
        }
    });

    if (stock) {
        stock.quantity -= quantity;

        if (stock.quantity > 0) {
            await stock.save();
        } else {
            await stock.destroy();
        }
    }
}



async function setStock(storeId, productId, quantity) {
    const stock = await Stock.findOne({
        where: {
            StoreId: storeId,
            ProductId: productId
        }
    });

    if (stock) {
        stock.quantity = quantity;
        await stock.save();
    } else {
        await Stock.create({
            StoreId: storeId,
            ProductId: productId,
            quantity: quantity
        });
    }
}

module.exports = {
    addStock,
    removeStock,
    setStock,
}