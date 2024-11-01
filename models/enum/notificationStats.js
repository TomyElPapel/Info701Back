const NotificationStats = {
    waiting : "waiting",
    send : "send",
    open : "open"
};

NotificationStats.All = Object.keys(NotificationStats);
Object.freeze(NotificationStats);


module.exports = NotificationStats;