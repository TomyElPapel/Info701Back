const { DataTypes } = require("sequelize") ;
const NotificationTypes = require("../enum/notificationTypes");
const NotificationStats = require("../enum/NotificationStats");
const ClientDeliveryStats = require("../enum/clientDeliveryStats")


module.exports = async function(sequelize) {
    const ClientDelivery = sequelize.models.ClientDelivery;
    const Employee = sequelize.models.Employee;


    const ClientDeliveryNotification = sequelize.define(
        'ClientDeliveryNotification',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            date: { type : DataTypes.TIME, defaultValue : DataTypes.NOW },
            type : { type : DataTypes.ENUM(NotificationTypes.All), defaultValue : NotificationTypes.clientDelivery },
            stat : { type : DataTypes.ENUM(NotificationStats.All), defaultValue : NotificationStats.waiting },
            deliveryStat : DataTypes.ENUM(ClientDeliveryStats.All)
        },
        {
            tableName: 'Client_Delivery_Notifications',
        },
    );

    ClientDeliveryNotification.belongsTo(Employee);
    Employee.hasMany(ClientDeliveryNotification);

    ClientDeliveryNotification.belongsTo(ClientDelivery);
    ClientDelivery.hasMany(ClientDeliveryNotification);

    ClientDelivery.belongsToMany(Employee, { through : ClientDeliveryNotification });
    Employee.belongsToMany(ClientDelivery, { through : ClientDeliveryNotification });
};

