const { models } = require("../../src/sequelize");
const { Op, where, col, fn } = require("sequelize");

const Roles = require("../../models/enum/roles");
const EmployeeService = require("../employeeService");
const ClientDeliveryNotificationService = require("../notifications/clientDeliveryNotificationService");
const ClientDeliveryStats = require("../../models/enum/clientDeliveryStats");
const workplace = require("../../models/associations/workplace");
const { ClientDelivery, Store, Employee, Accessory, Color, Product, Workplace} = models;


const attributes = ["id","deliveryDate","clientFirstName", "clientLastName", "deliveryAdress", "stat", "description", "needModification",  "modificationNotes", "createdAt", ]

const includeStore = {
    model: Store,
    attributes: ["id", "name", "adress"]
};
const includeTransporter = {
    model: Employee,
    as: "Transporter",
    attributes: ["id", "firstname", "lastname", "age", "mail"]
};
const includeCreator = {
    model: Employee,
    as: "Creator",
    attributes: ["id", "firstname", "lastname", "age", "mail"]
};
const includeProduct = {
    model: Product,
    attributes: ["id", "ref", "name", "unitPrice", "imgPath"]
}
const includeAccessory = {
    model: Accessory,
    attributes: ["id", "name", "price"]
}
const includeColor = {
    model: Color,
    attributes: ["id", "name", "display"]
}

const include = [includeStore, includeTransporter, includeCreator, includeProduct, includeAccessory, includeColor]


async function create(clientFirstName, clientLastName, adress, description, storeId, productId, colorId, accessoryId, creatorId) {
    const delivery = await ClientDelivery.create({
        clientFirstName : clientFirstName,
        clientLastName : clientLastName,
        deliveryDate: null,
        deliveryAdress : adress,
        description: description,

        StoreId : storeId,
        ProductId : productId,
        ColorId : colorId,
        AccessoryId : accessoryId,
        CreatorId : creatorId
    });




    const commercialManagers = await EmployeeService.findByRoleAndStore(Roles.commercialManager, storeId);
    for (let cm of commercialManagers) {
        await ClientDeliveryNotificationService.create(cm.id, ClientDeliveryStats.waitingForCommercialManager, delivery.id);
        //TODO envoie mail
    }

    await delivery.reload({
        include: include,
        attributes: attributes
    });


    return delivery;
}


async function confirmStockForDelivery(deliveryId, enoughStock) {
    const delivery = await findById(deliveryId);

    console.log(ClientDeliveryStats.waitingForCompletion);
    console.log(ClientDeliveryStats.waitingForProduct);

    if (enoughStock) {
        delivery.stat = ClientDeliveryStats.waitingForCompletion;
    } else  {
        delivery.stat = ClientDeliveryStats.waitingForProduct;
    }

    await delivery.save();
    await delivery.reload({
        include: include,
        attributes: attributes
    });

    return delivery;
}


async function completClientDelivery(deliveryId, needModification=false, modificationNotes=null) {
    const delivery = await findById(deliveryId);

    if (needModification) {
        delivery.needModification = needModification;
        delivery.modificationNotes = modificationNotes;

        delivery.stat = ClientDeliveryStats.waitingForAccessorist;
    } else {
        delivery.stat = ClientDeliveryStats.waitingForVerification;
    }

    await delivery.save();
    await delivery.reload({
        include: include,
        attributes: attributes
    });

    return delivery;
}

async function modifComplet(deliveryId) {
    const delivery = await findById(deliveryId);
    delivery.stat = ClientDeliveryStats.waitingForVerification;

    await delivery.save();
    await delivery.reload({
        include: include,
        attributes: attributes
    });

    return delivery;
}


async function validProduct(deliveryId) {
    const delivery = await findById(deliveryId);
    delivery.stat = ClientDeliveryStats.waitingForTransporter;

    await delivery.save();
    await delivery.reload({
        include: include,
        attributes: attributes
    });

    return delivery;
}

async function assignTransporterWithDate(deliveryId, transporterId, date) {
    const delivery = await ClientDelivery.findByPk(deliveryId);

    //TODO notif livreur set

    delivery.TransporterId = transporterId;
    delivery.deliveryDate = date;
    delivery.stat = ClientDeliveryStats.inDelivery;

    await delivery.save();
    await delivery.reload({
        include: include,
        attributes: attributes
    });

    return delivery;
}


async function setDeliveryDate(deliveryId, date) {
    const delivery = await ClientDelivery.findByPk(deliveryId);
    
    const preDate =  delivery.date;

    delivery.date = date;
    await delivery.save();

    if (preDate) {
        //TODO notif edit date livraison
    } else {
        //TODO ajout date de livraison
    }

    return delivery;
}


async function finishDelivery(deliveryId) {
    const delivery = await ClientDelivery.findByPk(deliveryId);

    delivery.stat = ClientDeliveryStats.delivered;

    await delivery.save();
    await delivery.reload({
        include: include,
        attributes: attributes
    });

    return delivery;
}


async function findByStore(storeId) {
    const deliveries = await ClientDelivery.findAll({
        where : {
            StoreId : storeId
        },
        attributes: attributes,
        include : include
    })

    return deliveries
}


async function findById(deliveryId) {
    const delivery = await ClientDelivery.findByPk(deliveryId, {
        attributes: attributes,
        include : include
    });

    return delivery;
}

async function findByEmployeeWorkplaceAndStat(employeeId, stat) {
    const deliveries = await ClientDelivery.findAll({
        attributes: attributes,
        where: {
            stat: stat
        },
        include: [
            {
                model: Store,
                required: true,
                attributes: ["id", "name", "adress"],
                include: {
                    model: Employee,
                    required: true,
                    where: { id: employeeId },
                    attributes: []
                },
            },
            includeCreator,includeAccessory,includeColor,includeProduct,includeTransporter
        ]
    });

    return deliveries;
}

async function findWaitTransporter() {
    const deliveries = await ClientDelivery.findAll({
        attributes: attributes,
        where: {
            stat: ClientDeliveryStats.waitingForTransporter,
        },
        include: include
    });

    return deliveries;
}

async function findFuturDeliveryByTransporter(transporterId) {
    const deliveries = await ClientDelivery.findAll({
        attributes: attributes,
        where: {
            deliveryDate: {
                [Op.gt]: new Date(),
            },
            TransporterId: transporterId,
            stat: ClientDeliveryStats.inDelivery,
        },
        include: include
    });

    return deliveries;
}

async function findTodayDeliveryByTransporter(transporterId) {
    const today = new Date().toISOString().split('T')[0];
    const deliveries = await ClientDelivery.findAll({
        attributes: attributes,
        where: {
            [Op.and]: [
                where(
                    fn('DATE', col('deliveryDate')),
                    '=',
                    today
                ),
                { stat: ClientDeliveryStats.inDelivery },
                { TransporterId: transporterId },
            ]
        },
        include: include
    });

    return deliveries;
}

async function findTodayDeliveryByWorkplace(employeeId) {
    const today = new Date().toISOString().split('T')[0];
    const deliveries = await ClientDelivery.findAll({
        attributes: attributes,
        where: {
            [Op.and]: [
                where(
                    fn('DATE', col('deliveryDate')),
                    '=',
                    today
                ),
                { stat: ClientDeliveryStats.inDelivery },
            ]
        },
        include: [
            {
                model: Store,
                required: true,
                attributes: ["id", "name", "adress"],
                include: {
                    model: Employee,
                    required: true,
                    where: { id: employeeId },
                    attributes: []
                },
            },
            includeCreator,includeAccessory,includeColor,includeProduct,includeTransporter
        ]
    });

    return deliveries;
}


module.exports = {
    create,
    findByStore,
    assignTransporterWithDate,
    setDeliveryDate,
    findById,
    confirmStockForDelivery,
    completClientDelivery,
    finishDelivery,
    validProduct,
    modifComplet,
    findByEmployeeWorkplaceAndStat,
    findWaitTransporter,
    findFuturDeliveryByTransporter,
    findTodayDeliveryByTransporter,
    findTodayDeliveryByWorkplace
}