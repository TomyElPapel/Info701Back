const { DataTypes } = require("sequelize") ;


module.exports = async function entitySetup(sequelize) {
    sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: DataTypes.STRING,
            age: DataTypes.INTEGER
        }
    );
};