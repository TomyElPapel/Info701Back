const { DataTypes } = require("sequelize");


module.exports = (sequelize) => {
    const User = sequelize.models.User;
    const Role = sequelize.models.Role;


    User.belongsToMany(Role, { through: "UserRoles", foreignKey: "user_id"});
    Role.belongsToMany(User, { through: "UserRoles", foreignKey: "role_id"});
}