const { DataTypes } = require("sequelize") ;
const NotificationTypes = require("../enum/notificationTypes");
const NotificationStats = require("../enum/NotificationStats");


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
            date: DataTypes.TIME,
            type : DataTypes.ENUM(NotificationTypes.All),
            stat : DataTypes.ENUM(NotificationStats.All)
        },
        {
            tableName: 'Client_Delivery_Notifications',
        },
    );

    ClientDeliveryNotification.belongsTo(Employee);
    Employee.hasMany(ClientDeliveryNotification);

    ClientDeliveryNotification.belongsTo(ClientDelivery);
    ClientDelivery.hasMany(ClientDeliveryNotification);
};

