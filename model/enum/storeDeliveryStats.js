const StoreDeliveryStats = {
    waitingForOtherStore : "waitingForOtherStore",
    waitingTransporter : "waitingTransporter",
    inDelivery : "inDelivery",
    delivered : "delivered",
};

StoreDeliveryStats.All = Object.keys(StoreDeliveryStats);
Object.freeze(StoreDeliveryStats);


module.exports = StoreDeliveryStats;