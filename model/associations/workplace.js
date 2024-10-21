const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Store = sequelize.models.Store;
    const Employee = sequelize.models.Employee;

    Employee.belongsToMany(Store, { through: "WorkPlace" });
    Store.belongsToMany(Employee, { through: "WorkPlace" });

    const WorkPlace = sequelize.models.WorkPlace;
    
    Employee.hasMany(WorkPlace);
    WorkPlace.belongsTo(Employee);
    Store.hasMany(WorkPlace);
    WorkPlace.belongsTo(Store);
}