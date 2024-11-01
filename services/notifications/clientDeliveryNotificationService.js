const { models } = require("../../src/sequelize");

const { ClientDeliveryNotification } = models;



async function create(employeeId, deliveryStat, deliveryId) {
    const notif = await ClientDeliveryNotification.create({
        EmployeeId: employeeId,
        ClientDeliveryId: deliveryId,
        deliveryStat: deliveryStat
    });

    return notif;
}



async function findByEmployee(employeeId) {
    const notifs = await ClientDeliveryNotification.findAll({
        where: {
            EmployeeId : employeeId
        }
    })

    return notifs;
}


module.exports = {
    create,
    findByEmployee
}