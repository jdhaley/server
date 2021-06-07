
import fs from "fs";

function compile(module) {
    let dir = fs.readdirSync("fs/source/" + module.name);
    let imports = "";
    let exports = "";
    for (let fname of dir) {
        let name = fname.substring(0, fname.lastIndexOf("."));
        fname = "./fs/source/" + module.name + "/" + fname;
        imports += `import ${name} from ${JSON.stringify(fname)};\n`
        exports += `\t${name}: ${name},\n`;
    }
    let pkg = imports + "export default {\n" + exports + "};\n";
    fs.writeFileSync("test.mjs", pkg);
    console.log(pkg);
    import("./test.mjs").then(mod => x(module, mod.default));
}

function x(module, pkgs) {
    console.log(pkgs);
}
function compilePackage(pkg, name) {
    let out = "const pkg = " + compileValue(pkg) + ";\n";
    out += "$out[" + JSON.stringify(name) + "] = pkg;\n";
    return out;
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