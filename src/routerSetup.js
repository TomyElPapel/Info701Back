const path = require("path");
const fs =  require("fs");


async function routerSetup(routesPath, app, basePath) {
    console.log("ratio");

    fs.readdir(routesPath, async (err, files) => {
        files.forEach(async (file) => {
            let filePath = path.join(routesPath, file);

            fs.stat(filePath, async (err, stats) => {
                if (stats.isFile() && (file.endsWith(".js") || file.endsWith(".ts"))) {
                    let router = require(filePath);
                    var p;
                    if (file == "index.js" || file == "index.ts") {
                        p = basePath.slice(0, -1);
                    } else {
                        p = basePath + file.slice(0, -3);
                    }
                    console.log(p);
                    app.use(p, router);
                } else if (stats.isDirectory()) {
                    await routerSetup(filePath, app, basePath + file + "/");
                }
            });
        })
    });
}

module.exports = routerSetup;