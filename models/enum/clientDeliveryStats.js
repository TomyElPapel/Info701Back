const ClientDeliveryStats = {
    waitingForCommercialManager : "waitingForCommercialManager",
    waitingForProduct : "waitingForProduct",
    waitingForCompletion : "waitingForCompletion",
    waitingForAccessorist : "waitingForAccessorist",
    waitingForVerification : "waitingForVerification",
    waitingForTransporter : "waitingForTransporter",
    inDelivery : "inDelivery",
    delivered : "delivered"
};

ClientDeliveryStats.All = Object.keys(ClientDeliveryStats);
Object.freeze(ClientDeliveryStats);


module.exports = ClientDeliveryStats;