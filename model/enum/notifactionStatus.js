const NotificationStatus = {
    good : "good",
    wait : "wait",
};

NotificationStatus.All = Object.keys(NotificationStatus);
Object.freeze(NotificationStatus);


module.exports = NotificationStatus;