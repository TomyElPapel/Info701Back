const ClientDeliveryStats = {
    waitingForCommercialManager : "waitingForCommercialManager",
    waitingForProduct : "waitForProduct",
    waitingForStoreDelivery : "waitingForStoreDelivery",
    waitingForAccessorist : "waitingForAccessorist",
    waitingForVerification : "waitingForVerification",
    waitingForTransporter : "waitingForTransporter",
    inDelivery : "inDelivery",
    delivered : "delivered"
};

ClientDeliveryStats.All = Object.keys(ClientDeliveryStats);
Object.freeze(ClientDeliveryStats);


module.exports = ClientDeliveryStats;