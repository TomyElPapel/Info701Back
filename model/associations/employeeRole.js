const { DataTypes } = require("sequelize") ;
const Roles = require("../enum/roles");

module.exports = async function(sequelize) {
    const Employee = sequelize.models.Employee;

    const Role = sequelize.define(
        "Role",
        {
            role : DataTypes.ENUM(Roles.All)
        }, 
        {
            createdAt: false,
            updatedAt: false,
            tableName: 'Roles'
        }
    );

    Employee.hasMany(Role);
    Role.belongsTo(Employee);
}