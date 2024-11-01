const { DataTypes } = require("sequelize") ;
const NotificationTypes = require("../enum/notificationTypes");
const NotificationStats = require("../enum/NotificationStats");


module.exports = async function(sequelize) {
    const StoreDelivery = sequelize.models.StoreDelivery;
    const Employee = sequelize.models.Employee;


    const StoreDeliveryNotification = sequelize.define(
        'StoreDeliveryNotification',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            date: DataTypes.TIME,
            type : DataTypes.ENUM(NotificationTypes.All),
            stat : DataTypes.ENUM(NotificationStats.All)
        },
        {
            tableName: 'Store_Delivery_Notifications',
        },
    );

    StoreDeliveryNotification.belongsTo(Employee);
    Employee.hasMany(StoreDeliveryNotification);

    StoreDeliveryNotification.belongsTo(StoreDelivery);
    StoreDelivery.hasMany(StoreDeliveryNotification);
};