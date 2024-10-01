const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    sequelize.define(
        'Product',
        {
            id: {
                type: DataTypes.STRING,
                unique: true,
                primaryKey: true,
            },
            name: DataTypes.STRING,
            price: DataTypes.FLOAT
        }
    );
};