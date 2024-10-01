const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Accessory = sequelize.models.Accessory;
    const Product = sequelize.models.Product;

    sequelize.define(
        "ProductAccessory",
        {
            product_id: {
                type: DataTypes.STRING,
                references: {
                    model: Product,
                    key: "id"
                } 
            },
            accessory_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: Accessory,
                    key: "id"
                } 
            },
        }, 
        {
            tableName: "ProductAccessories",
            createdAt: false,
            updatedAt: false
        }
    );

    Accessory.belongsToMany(Product, { through: "ProductAccessory", foreignKey: "accessory_id" });
    Product.belongsToMany(Accessory, { through: "ProductAccessory", foreignKey: "product_id" });
}