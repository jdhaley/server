
import fs from "fs";

async function compile(sourceDir, module) {
    module.packages = {};
    let dir = fs.readdirSync(sourceDir + module.id);
    for (let fname of dir) {
        let name = fname.substring(0, fname.lastIndexOf("."));
        fname = "./" + sourceDir + module.id + "/" + fname;
        module.packages[name] = (await import(fname)).default;
    }
}

export default compile;