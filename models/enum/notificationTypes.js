const NotificationTypes = {
    other : "other",
    storeDelivery : "storeDelivery",
    clientDelivery : "clientDelivery"
};

NotificationTypes.All = Object.keys(NotificationTypes);
Object.freeze(NotificationTypes);


module.exports = NotificationTypes;