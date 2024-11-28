const { models } = require("../../src/sequelize");

const Roles = require("../../models/enum/roles");
const EmployeeService = require("../employeeService");
const StoreDeliveryStats = require("../../models/enum/storeDeliveryStats");
const ClientDeliveryService = require("./clientDeliveryService");
const { StoreDelivery, Store, Employee, Product, ClientDelivery } = models;


const include = [
    {
        model: Store,
        attributes: ["id", "name", "adress"],
        as: "StoreFrom"
    },
    {
        model: Store,
        attributes: ["id", "name", "adress"],
        as: "StoreTo"
    },
    {
        model: Employee,
        as: "Creator",
        attributes: ["id", "firstname", "lastname", "age", "mail"]
    },
    {
        model: Employee,
        as: "Transporter",
        attributes: ["id", "firstname", "lastname", "age", "mail"]
    },
    {
        model: Product,
        attributes: ["id", "ref", "name", "unitPrice", "imgPath"],
    }
]


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

    console.log(storeDelivery);

    if (storeDelivery.StoreToId == storeId || storeDelivery.stat != StoreDeliveryStats.waitingForOtherStore) {
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

    if (storeDelivery.stat != StoreDeliveryStats.waitingTransporter) {
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



module.exports = {
    create,
    findAll,
    findById,
    assignDeliveryStore,
    assignTransporter,
    confirmDelivery,
    createFromClientDelivery
}