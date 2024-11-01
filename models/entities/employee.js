const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const User = sequelize.define(
        'Employee',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            firstname: DataTypes.STRING,
            lastname: DataTypes.STRING,
            age: DataTypes.INTEGER,
            mail: DataTypes.STRING,
            password: DataTypes.STRING
        }
    );

};