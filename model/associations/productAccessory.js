const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Accessory = sequelize.models.Accessory;
    const Product = sequelize.models.Product;


    Accessory.belongsToMany(Product, { through: "ProductAccessory" });
    Product.belongsToMany(Accessory, { through: "ProductAccessory" });

    const ProductAccessory = sequelize.models.ProductAccessory;

    Product.hasMany(ProductAccessory);
    ProductAccessory.belongsTo(Product);
    Accessory.hasMany(ProductAccessory);
    ProductAccessory.belongsTo(Accessory);
}