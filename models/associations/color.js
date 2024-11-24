const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Product = sequelize.models.Product;

    const Color = sequelize.define(
        "Color",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING,
            display: DataTypes.STRING
        },
        {
            createdAt: false,
            updatedAt: false
        }
    );

    Color.belongsTo(Product);
    Product.hasMany(Color);
}