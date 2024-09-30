module.exports = (sequelize) => {
    const User = sequelize.models.User;
    const Car = sequelize.models.Car;

    User.hasMany(Car, {
        foreignKey: 'user_id',
    });
}