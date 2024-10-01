const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Employee = sequelize.models.Employee;
    const Role = sequelize.models.Role;

    sequelize.define(
        "EmployeeRole",
        {
            employee_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: Employee,
                    key: "id"
                } 
            },
            role_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: Role,
                    key: "id"
                } 
            },
        },
        {
            createdAt: false,
            updatedAt: false
        }
    );

    Role.belongsToMany(Employee, { through: "EmployeeRole", foreignKey: "role_id" });
    Employee.belongsToMany(Role, { through: "EmployeeRole", foreignKey: "employee_id" });
}