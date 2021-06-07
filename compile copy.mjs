
import fs from "fs";

function compile(sourceDir, module) {
    load(sourceDir, module);
    let out = "";
    for (let name in module.packages) {
        out += compilePackage(module.packages[name], name);
    }
    console.log(out);
}
async function load(sourceDir, module) {
    module.packages = {};
    let dir = fs.readdirSync(sourceDir + module.id);
    for (let fname of dir) {
        let name = fname.substring(0, fname.lastIndexOf("."));
        fname = "./" + sourceDir + module.id + "/" + fname;
        module.packages[name] = (await import(fname)).default;
    }
}

function compilePackage(pkg, name) {
    return `${name}: function name() {\n\treturn ${compileValue(pkg)}}\n}`;
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
    for (let name of value) {
        out += compileValue(value[name], depth) + ", "
    }
    if (out.endsWith(", ")) out = out.substring(0, out.length - 2);
    return "[" + out + "]";
}
function compileObject(value, depth) {
    depth++;
    let out = "";
    for (let name in value) {
        out += indent(depth) + JSON.stringify(name) + ": " + compileValue(value[name], depth) + ","
    }
    if (out.endsWith(",")) out = out.substring(0, out.length - 1);
    return "{" + out + indent(depth - 1) + "}";
}
function indent(depth) {
    let out = "\n";
    for (let i = 0; i < depth; i++) out += "\t";
    return out;
}

export default compile;