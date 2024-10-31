const { DataTypes } = require("sequelize") ;


module.exports = async function(sequelize) {
    const Product = sequelize.models.Product;
    const Store = sequelize.models.Store;
    const Employee = sequelize.models.Employee;
    const Color = sequelize.models.Color;
    const Accessory = sequelize.models.Accessory;

    const Client_Delivery = sequelize.define(
        'Client_Delivery',
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

        },
        {
            tableName: 'Client_Deliveries',
        },
    );

    Client_Delivery.belongsTo(Store);
    Store.hasMany(Client_Delivery);

    Client_Delivery.belongsTo(Employee, { as : "Transporter" });
    Client_Delivery.belongsTo(Employee, { as : "Creator" });

    Client_Delivery.belongsTo(Product);
    Client_Delivery.belongsTo(Color);
    Client_Delivery.belongsTo(Accessory);
};