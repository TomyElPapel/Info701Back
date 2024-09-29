const path = require("path");
const fs =  require("fs");


async function routerSetup(routesPath, app) {
    fs.readdir(routesPath, async (er, files) => {
        files.forEach(async (file) => {
            let filePath = path.join(routesPath, file);

            console.log(filePath);

            fs.stat(filePath, async (err, stats) => {
                if (stats.isFile() && file.endsWith(".js")) {
                    let router = require(filePath);
                    app.use("/", router);
                } else if (stats.isDirectory()) {
        
                    await routerSetup(filePath, app);
                }
            });
        })
    });
}

module.exports = routerSetup;