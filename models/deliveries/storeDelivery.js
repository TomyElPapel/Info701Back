const { DataTypes } = require("sequelize") ;
const StoreDeliveryStats = require("../enum/storeDeliveryStats");


module.exports = async function(sequelize) {
    const Product = sequelize.models.Product;
    const Store = sequelize.models.Store;
    const Employee = sequelize.models.Employee;
    const ClientDelivery = sequelize.models.ClientDelivery;

    const StoreDelivery = sequelize.define(
        'StoreDelivery',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            deliveryDate: DataTypes.DATEONLY,
            stat : DataTypes.ENUM(StoreDeliveryStats.All)
        },
        {
            tableName: 'Store_Deliveries',
        },
    );

    StoreDelivery.belongsTo(Store, { as : "StoreFrom" });
    StoreDelivery.belongsTo(Store, { as : "StoreTo" });
    
    StoreDelivery.belongsTo(Employee, { as : "Transporter" });
    StoreDelivery.belongsTo(Employee, { as : "Creator" });

    StoreDelivery.belongsTo(Product);

    StoreDelivery.belongsTo(ClientDelivery);
};