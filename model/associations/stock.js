const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Store = sequelize.models.Store;
    const Product = sequelize.models.Product;

    const Stock = sequelize.define(
        "Stock",
        {
            quantity: DataTypes.INTEGER
        }, 
        {
            createdAt: false,
            updatedAt: false
        }
    );

    Store.belongsToMany(Product, { through: Stock });
    Product.belongsToMany(Store, { through: Stock });
    Product.hasMany(Stock);
    Stock.belongsTo(Product);
    Store.hasMany(Stock);
    Stock.belongsTo(Store);
}