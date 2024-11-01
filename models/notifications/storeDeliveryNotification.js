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
            date: { type : DataTypes.TIME, defaultValue : DataTypes.NOW },
            type : { type : DataTypes.ENUM(NotificationTypes.All), defaultValue : NotificationTypes.storeDelivery },
            stat : { type : DataTypes.ENUM(NotificationStats.All), defaultValue : NotificationStats.waiting }
        },
        {
            tableName: 'Store_Delivery_Notifications',
        },
    );

    StoreDeliveryNotification.belongsTo(Employee);
    Employee.hasMany(StoreDeliveryNotification);

    StoreDeliveryNotification.belongsTo(StoreDelivery);
    StoreDelivery.hasMany(StoreDeliveryNotification);

    StoreDelivery.belongsToMany(Employee, { through : StoreDeliveryNotification });
    Employee.belongsToMany(StoreDelivery, { through : StoreDeliveryNotification });
};