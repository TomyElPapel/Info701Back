const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Employee = sequelize.models.Employee;
    const Role = sequelize.models.Role;


    Role.belongsToMany(Employee, { through: "EmployeeRole" });
    Employee.belongsToMany(Role, { through: "EmployeeRole" });

    const EmployeeRole = sequelize.models.EmployeeRole;

    Employee.hasMany(EmployeeRole);
    EmployeeRole.belongsTo(Employee);
    Role.hasMany(EmployeeRole);
    EmployeeRole.belongsTo(Role);
}