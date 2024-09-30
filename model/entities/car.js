const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    sequelize.define(
        'Car',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            model: DataTypes.STRING,
        }
    );
};