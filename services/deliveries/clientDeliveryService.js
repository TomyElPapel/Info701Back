const { models } = require("../../src/sequelize");

const Roles = require("../../models/enum/roles");
const EmployeeService = require("../employeeService");
const ClientDeliveryNotificationService = require("../notifications/clientDeliveryNotificationService");
const ClientDeliveryStats = require("../../models/enum/clientDeliveryStats")
const { ClientDelivery } = models;



async function create(clientFirstName, clientLastName, adress, storeId, productId, colorId, accessoryId, creatorId) {
    const delivery = await ClientDelivery.create({
        clientFirstName : clientFirstName,
        clientLastName : clientLastName,
        deliveryDate: null,
        deliveryAdress : adress,

        StoreId : storeId,
        ProductId : productId,
        ColorId : colorId,
        AccessoryId : accessoryId,
        CreatorId : creatorId
    });

    const commercialManagers = await EmployeeService.findByRoleAndStore(Roles.commercialManager, storeId);
    for (let cm of commercialManagers) {
        await ClientDeliveryNotificationService.create(cm.id, ClientDeliveryStats.waitingForCommercialManager, delivery.id);
    }

    return delivery;
}



async function findByStore(storeId) {
    const deliveries = await ClientDelivery.findAll({
        where : {
            StoreId : storeId
        }
    })

    return deliveries
}


module.exports = {
    create,
    findByStore
}