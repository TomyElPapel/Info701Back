const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Store = sequelize.models.Store;
    const Employee = sequelize.models.Employee;

    sequelize.define(
        "Workplace",
        {
            employee_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: Employee,
                    key: "id"
                } 
            },
            store_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: Store,
                    key: "id"
                } 
            },
        }, 
        {
            createdAt: false,
            updatedAt: false
        }
    );

    Employee.belongsToMany(Store, { through: "Workplace", foreignKey: "employee_id" });
    Store.belongsToMany(Employee, { through: "Workplace", foreignKey: "store_id" });
}