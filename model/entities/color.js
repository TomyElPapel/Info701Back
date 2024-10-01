const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Product = sequelize.models.Product;

    sequelize.define(
        "Color",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING
        },
    );
}