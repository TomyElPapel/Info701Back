const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Color = sequelize.models.Color;
    const Product = sequelize.models.Product;

    Color.belongsTo(Product);
}