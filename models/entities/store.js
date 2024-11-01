const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    sequelize.define(
        'Store',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING,
            adress: DataTypes.STRING
        }
    );
};