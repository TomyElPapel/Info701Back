const { DataTypes } = require("sequelize") ;
const Roles = require("../enum/roles");

module.exports = async function(sequelize) {
    const Employee = sequelize.models.Employee;

    const EmployeeRole = sequelize.define(
        "EmployeeRoles",
        {
            role : DataTypes.ENUM(Roles.All)
        }, 
        {
            createdAt: false,
            updatedAt: false,
            tableName: 'Employee_Roles'
        }
    );

    Employee.hasMany(EmployeeRole);
    EmployeeRole.belongsTo(Employee);
}