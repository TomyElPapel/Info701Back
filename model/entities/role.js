const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    sequelize.define(
        'Role',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING,
        }
    );
};