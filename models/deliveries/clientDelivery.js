const { DataTypes } = require("sequelize") ;
const ClientDeliveryStats = require("../enum/clientDeliveryStats");


module.exports = async function(sequelize) {
    const Product = sequelize.models.Product;
    const Store = sequelize.models.Store;
    const Employee = sequelize.models.Employee;
    const Color = sequelize.models.Color;
    const Accessory = sequelize.models.Accessory;

    const ClientDelivery = sequelize.define(
        'ClientDelivery',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            deliveryDate: DataTypes.DATE,
            clientFirstName: DataTypes.STRING,
            clientLastName: DataTypes.STRING,
            deliveryAdress: DataTypes.STRING,
            stat : { type : DataTypes.ENUM(ClientDeliveryStats.All), defaultValue : ClientDeliveryStats.waitingForCommercialManager }
        },
        {
            tableName: 'Client_Deliveries',
        },
    );

    ClientDelivery.belongsTo(Store);
    Store.hasMany(ClientDelivery);

    ClientDelivery.belongsTo(Employee, { as : "Transporter" });
    ClientDelivery.belongsTo(Employee, { as : "Creator" });

    ClientDelivery.belongsTo(Product);
    ClientDelivery.belongsTo(Color);
    ClientDelivery.belongsTo(Accessory);
};