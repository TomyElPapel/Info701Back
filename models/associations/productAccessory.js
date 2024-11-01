const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Accessory = sequelize.models.Accessory;
    const Product = sequelize.models.Product;

    const ProductAccessory = sequelize.define(
        "ProductAccessory",
        {},
        {
            createdAt: false,
            updatedAt: false,
            tableName: 'Product_Accessory',
        },
        
    );


    Accessory.belongsToMany(Product, { through: ProductAccessory });
    Product.belongsToMany(Accessory, { through: ProductAccessory });


    Product.hasMany(ProductAccessory);
    ProductAccessory.belongsTo(Product);
    Accessory.hasMany(ProductAccessory);
    ProductAccessory.belongsTo(Accessory);
}