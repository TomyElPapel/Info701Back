const Roles = {
    transporter : "transporter",
    shopAssistant : "shopAssistant",
    commercialManager : "commercialManager",
    secretary : "secretary",
    financialManager : "financialManager",
    accessorist : "accessorist",
    productExperts : "productExperts"
};

Roles.All = Object.keys(Roles);
Object.freeze(Roles);


module.exports = Roles;