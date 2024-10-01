const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Store = sequelize.models.Store;
    const Product = sequelize.models.Product;

    sequelize.define(
        "Stock",
        {
            product_id: {
                type: DataTypes.STRING,
                references: {
                    model: Product,
                    key: "id"
                } 
            },
            store_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: Store,
                    key: "id"
                } 
            },
            quantity: DataTypes.INTEGER
        }, 
        {
            createdAt: false,
            updatedAt: false
        }
    );

    Store.belongsToMany(Product, { through: "Stock", foreignKey: "store_id" });
    Product.belongsToMany(Store, { through: "Stock", foreignKey: "product_id" });
}