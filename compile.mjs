
import fs from "fs";

export default function compileAll(sourceDir, targetDir) {
    let dir = fs.readdirSync(sourceDir);
    for (let name of dir) {
        load(sourceDir, name).then(m => compile(targetDir, m));
    }   
}

async function load(sourceDir, name) {
    let module = (await import("./" + sourceDir + "/" + name + "/module.mjs")).default;
    if (module.name && module.name != name) {
        log("Warning: module name doesn't match folder name. Using folder name");
    }
    module.name = name;
    module.package = {};
    let dir = fs.readdirSync(sourceDir + "/" + module.name + "/package");
    for (let fname of dir) {
        let index = fname.lastIndexOf(".");
        let name = fname.substring(0, index);
        let ext = fname.substring(index + 1);
        if (ext == "mjs") {
            fname = "./" + sourceDir + "/" + module.name + "/package/" + fname;
            module.package[name] = (await import(fname)).default;    
        }
    }
    return module;
}

function compile(targetDir, module) {
    console.log("Compiling: " + module.name + "-" + module.version);
    let conf = module.conf;
    let main = module.main;
    let uses = module.use;
    let packages = module.package;
    module = {
        name: module.name,
        version: module.version,
        moduleType: module.type,
    };
    let out = "";
    let use = "";
    for (let name in uses) {
        use += "\t" + JSON.stringify(name) + ": " + name + ",\n";
        out += `import ${name} from ${JSON.stringify("/target/" + uses[name] + ".mjs")};\n`;
    }
    out += "const module = " + compileValue(module) + ";\n";
    out += "module.use = {\n" + use + "};\n"
    out += "module.package = {";
    let pkg = "";
    for (let name in packages) {
        pkg += compilePackage(name, packages[name]);
        out += `\n\t${name}: ${name}(),`;
    }
    out += "\n};\n"
    out += "export default module;\n\n";
    out += "const conf = " + compileValue(conf) + ";\n";
    out +=  compileValue(main); // + ".call(module, conf);\n";
    out += pkg;

    fs.writeFileSync(targetDir + "/" + module.name + "-" + module.version + ".mjs", out);
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
