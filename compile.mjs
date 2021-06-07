
import { log } from "console";
import fs from "fs";

let module = {
    id: "base.youni.works",
    version: "1.2.0"
};
compile("source/", module);
console.log(module);

async function compile(sourceDir, module) {
    module.packages = {};
    let dir = fs.readdirSync(sourceDir + module.id + "/packages");
    for (let fname of dir) {
        let index = fname.lastIndexOf(".");
        let name = fname.substring(0, index);
        let ext = fname.substring(index + 1);
        if (ext == "mjs") {
            fname = "./" + sourceDir + module.id + "/packages/" + fname;
            module.packages[name] = (await import(fname)).default;    
        }
    }
}

export default compile;