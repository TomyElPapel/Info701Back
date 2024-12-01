const { models } = require("../../src/sequelize");
const { Op, where, col, fn } = require("sequelize");


const Roles = require("../../models/enum/roles");
const EmployeeService = require("../employeeService");
const StoreDeliveryStats = require("../../models/enum/storeDeliveryStats");
const ClientDeliveryService = require("./clientDeliveryService");
const { StoreDelivery, Store, Employee, Product, ClientDelivery } = models;

const includeStoreFrom = {
    model: Store,
    attributes: ["id", "name", "adress"],
    as: "StoreFrom"
};
const includeStoreTo = {
    model: Store,
    attributes: ["id", "name", "adress"],
    as: "StoreTo"
}
const includeCreator = {
    model: Employee,
    as: "Creator",
    attributes: ["id", "firstname", "lastname", "age", "mail"]
}
const includeTransporter = {
    model: Employee,
    as: "Transporter",
    attributes: ["id", "firstname", "lastname", "age", "mail"]
}
const includeProduct = {
    model: Product,
    attributes: ["id", "ref", "name", "unitPrice", "imgPath"],
}
const include = [includeStoreFrom, includeStoreTo, includeCreator, includeTransporter, includeProduct];


const attributes = ["id", "deliveryDate", "stat", "ClientDeliveryId"]




async function create(storeToId, creatorId, productId) {
    const storeDelivery = await StoreDelivery.create({
        StoreToId: storeToId,
        CreatorId: creatorId, 
        ProductId: productId,
        stat: StoreDeliveryStats.waitingForOtherStore
    });

    // TODO notif tout les RCO

    await storeDelivery.reload({
        include: include,
        attributes: attributes
    });

    return storeDelivery;
}


async function createFromClientDelivery(clientDeliveryId, commercialManagerId) {
    const clientDelivery = await ClientDelivery.findByPk(clientDeliveryId);

    const storeDelivery = await StoreDelivery.create({
        StoreToId: clientDelivery.StoreId,
        CreatorId: commercialManagerId, 
        ProductId: clientDelivery.ProductId,
        ClientDeliveryId: clientDeliveryId,
        stat: StoreDeliveryStats.waitingForOtherStore
    });

    // TODO notif tout les RCO

    return storeDelivery;
}


async function findAll() {
    const storeDeliveries = await StoreDelivery.findAll({
        attributes: attributes,
        include: include
    });

    return storeDeliveries;
}

async function findById(deliveryId) {
    const storeDelivery = await StoreDelivery.findByPk(deliveryId, {
        attributes: attributes,
        include: include
    });

    return storeDelivery;
}

async function assignDeliveryStore(deliveryId, storeId) {
    const storeDelivery = await findById(deliveryId);

    if (!storeDelivery) {
        return null;
    }

    if (storeDelivery.StoreToId == storeId) {
        return;
    }

    storeDelivery.StoreFromId = storeId;
    storeDelivery.stat = StoreDeliveryStats.waitingTransporter;
    await storeDelivery.save();
    await storeDelivery.reload({
        include: include,
        attributes: attributes
    })

    // TODO notif rco mag origin + livreur

    return storeDelivery;
}

async function assignTransporter(deliveryId, transporterId, deliveryDate) {
    const storeDelivery = await findById(deliveryId);

    if (!storeDelivery) {
        return null;
    }

    storeDelivery.TransporterId = transporterId;
    storeDelivery.deliveryDate = deliveryDate;

    storeDelivery.stat = StoreDeliveryStats.inDelivery;

    await storeDelivery.save();
    await storeDelivery.reload({
        include: include,
        attributes: attributes
    })

    // TODO notif rco 2 store

    return storeDelivery;
}

async function confirmDelivery(deliveryId) {
    const storeDelivery = await findById(deliveryId);

    if (!storeDelivery) {
        return null;
    }

    if (storeDelivery.stat != StoreDeliveryStats.inDelivery) {
        return null;
    }

    console.log(storeDelivery);


    storeDelivery.stat = StoreDeliveryStats.delivered;

    await storeDelivery.save();
    await storeDelivery.reload({
        include: include,
        attributes: attributes
    })


    if (storeDelivery.ClientDeliveryId) {
        ClientDeliveryService.confirmStockForDelivery(storeDelivery.ClientDeliveryId, true);
    }

    // TODO notif rco mag + vendeur

    return storeDelivery;
}

async function findByEmployeeWorkplaceAndStat(employeeId, stat) {
    const deliveries = await StoreDelivery.findAll({
        attributes: attributes,
        where: {
            stat: stat
        },
        include: [
            {
                model: Store,
                as: "StoreTo",
                required: true,
                attributes: ["id", "name", "adress"],
                include: {
                    model: Employee,
                    required: true,
                    where: { id: employeeId },
                    attributes: []
                },
            },
            includeCreator,includeStoreFrom,includeProduct,includeTransporter
        ]
    });

    return deliveries;
}

async function findWaitTransporter() {
    const deliveries = await StoreDelivery.findAll({
        attributes: attributes,
        where: {
            stat: StoreDeliveryStats.waitingTransporter,
        },
        include: include
    });

    return deliveries;
}

async function findFuturDeliveryByTransporter(transporterId) {
    const deliveries = await StoreDelivery.findAll({
        attributes: attributes,
        where: {
            deliveryDate: {
                [Op.gt]: new Date(),
            },
            TransporterId: transporterId,
            stat: StoreDeliveryStats.inDelivery,
        },
        include: include
    });

    return deliveries;
}

async function findTodayDeliveryByTransporter(transporterId) {
    const today = new Date().toISOString().split('T')[0];
    const deliveries = await StoreDelivery.findAll({
        attributes: attributes,
        where: {
            [Op.and]: [
                where(
                    fn('DATE', col('deliveryDate')),
                    '=',
                    today
                ),
                { stat: StoreDeliveryStats.inDelivery },
                { TransporterId: transporterId },
            ]
        },
        include: include
    });

    return deliveries;
}

async function findTodayDeliveryByWorkplace(employeeId) {
    const today = new Date().toISOString().split('T')[0];
    const deliveries = await StoreDelivery.findAll({
        attributes: attributes,
        where: {
            [Op.and]: [
                where(
                    fn('DATE', col('deliveryDate')),
                    '=',
                    today
                ),
                { stat: StoreDeliveryStats.inDelivery },
            ]
        },
        include: [
            {
                model: Store,
                required: true,
                as: "StoreTo",
                attributes: ["id", "name", "adress"],
                include: {
                    model: Employee,
                    required: true,
                    where: { id: employeeId },
                    attributes: []
                },
            },
            includeCreator,includeProduct,includeTransporter
        ]
    });

    return deliveries;
}



module.exports = {
    create,
    findAll,
    findById,
    assignDeliveryStore,
    assignTransporter,
    confirmDelivery,
    createFromClientDelivery,
    findByEmployeeWorkplaceAndStat,
    findWaitTransporter,
    findFuturDeliveryByTransporter,
    findTodayDeliveryByWorkplace,
    findTodayDeliveryByTransporter
}