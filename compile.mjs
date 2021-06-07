
import fs from "fs";

let module = {
    id: "base.youni.works",
    version: "1.2.0"
};
compile("fs/source/", module);
console.log(module);

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