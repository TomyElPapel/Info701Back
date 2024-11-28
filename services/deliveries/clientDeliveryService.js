const { models } = require("../../src/sequelize");

const Roles = require("../../models/enum/roles");
const EmployeeService = require("../employeeService");
const ClientDeliveryNotificationService = require("../notifications/clientDeliveryNotificationService");
const ClientDeliveryStats = require("../../models/enum/clientDeliveryStats")
const { ClientDelivery, Store, Employee, Accessory, Color, Product} = models;



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

const attributes = ["id","deliveryDate","clientFirstName", "clientLastName", "deliveryAdress", "stat", "description", "needModification",  "modificationNotes", "createdAt", ]
const include = [
    {
        model: Store,
        attributes: ["id", "name", "adress"]
    },
    {
        model: Employee,
        as: "Transporter",
        attributes: ["id", "firstname", "lastname", "age", "mail"]
    },
    {
        model: Employee,
        as: "Creator",
        attributes: ["id", "firstname", "lastname", "age", "mail"]
    },
    {
        model: Product,
        attributes: ["id", "ref", "name", "unitPrice", "imgPath"]
    },
    {
        model: Accessory,
        attributes: ["id", "name", "price"]
    },
    {
        model: Color,
        attributes: ["id", "name", "display"]
    }
]


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
    modifComplet
}