const path = require("path");
const fs =  require("fs");


async function routerSetup(routesPath, app, basePath) {
    fs.readdir(routesPath, async (err, files) => {
        files.forEach(async (file) => {
            let filePath = path.join(routesPath, file);

            fs.stat(filePath, async (err, stats) => {
                if (stats.isFile() && file.endsWith(".js")) {
                    let router = require(filePath);
                    let p = basePath + file.slice(0, -3);
                    app.use(p, router);
                } else if (stats.isDirectory()) {
        
                    await routerSetup(filePath, app, basePath + file + "/");
                }
            });
        })
    });
}

module.exports = routerSetup;