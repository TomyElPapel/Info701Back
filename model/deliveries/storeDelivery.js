const { DataTypes } = require("sequelize") ;
const StoreDeliveryStats = require("../enum/storeDeliveryStats");


module.exports = async function(sequelize) {
    const Product = sequelize.models.Product;
    const Store = sequelize.models.Store;
    const Employee = sequelize.models.Employee;

    const Store_Delivery = sequelize.define(
        'Store_Delivery',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            deliveryDate: DataTypes.DATE,
            stat : DataTypes.ENUM(StoreDeliveryStats.All)
        },
        {
            tableName: 'Store_Deliveries',
        },
    );

    Store_Delivery.belongsTo(Store, { as : "StoreFrom" });
    Store_Delivery.belongsTo(Store, { as : "StoreTo" });
    
    Store_Delivery.belongsTo(Employee, { as : "Transporter" });
    Store_Delivery.belongsTo(Employee, { as : "Creator" });

    Store_Delivery.belongsTo(Product, { as : "Product" });
};