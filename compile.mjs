
import fs from "fs";
load("source", "base.youni.works").then(m => compile("target", m));

async function load(sourceDir, id) {
    let module = (await import("./" + sourceDir + "/" + id + "/conf.mjs")).default;
    if (module.id && module.id != id) {
        log("Warning: module.id doesn't match folder name. Using folder name");
    }
    module.id = id;
    module.packages = {};
    let dir = fs.readdirSync(sourceDir + "/" + module.id + "/packages");
    for (let fname of dir) {
        let index = fname.lastIndexOf(".");
        let name = fname.substring(0, index);
        let ext = fname.substring(index + 1);
        if (ext == "mjs") {
            fname = "./" + sourceDir + "/" + module.id + "/packages/" + fname;
            module.packages[name] = (await import(fname)).default;    
        }
    }
    return module;
}

function compile(targetDir, module) {
    console.log(module);
    let packages = module.packages;
    delete module.packages;
    let out = "";
    out += "const module = " + compileValue(module) + ";\n";

    out += "module.packages = {";
    for (let name in packages) {
        out += `\n\t${name}: ${name}(),`;
    }
    out += "\n};\n"

    for (let name in packages) {
        out += compilePackage(name, packages[name]);
    }
    out += "\nexport default module;\n";

    fs.writeFileSync(targetDir + "/" + module.id + "-" + module.version + ".mjs", out);
}

function compilePackage(name, pkg) {
    return `\nfunction ${name}() {\nconst pkg = ${compileValue(pkg)}\nreturn pkg;\n}\n`;
}

function compileValue(value, depth) {
    switch (typeof value) {
        case "undefined":
        case "boolean":
        case "number":
            return value;
        case "string":
            return JSON.stringify(value);
        case "function":
            return value.toString();
        case "object":
            if (!value) return "null";
            if (Object.getPrototypeOf(value) == Array.prototype) return compileArray(value, depth || 0);
            return compileObject(value, depth || 0);
    }
}
function compileArray(value, depth) {
    depth++;
    let out = "";
    for (let name in value) {
        out += compileValue(value[name], depth) + ", "
    }
    if (out.endsWith(", ")) out = out.substring(0, out.length - 2);
    return "[" + out + "]";
}
function compileObject(value, depth) {
    depth++;
    let out = "";
    for (let name in value) {
        out += indent(depth) + JSON.stringify(name) + ": " + compileValue(value[name], depth) + ",";
    }
    if (out.endsWith(",")) out = out.substring(0, out.length - 1);
    return "{" + out + indent(depth - 1) + "}";
}
function indent(depth) {
    let out = "\n";
    for (let i = 0; i < depth; i++) out += "\t";
    return out;
}
