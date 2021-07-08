
import fs from "fs";
export default function loader(dir) {
    return function loader(req, res) {
        let content = load(dir);
        content = JSON.stringify(content);
        res.set("Content-Type", "text/plain");
        res.send(content);
    }
}
function load(path) {
    const dir = Object.create(null);
    dir[Symbol.for("dir")] = path;
    loaddir(dir, "./" + path);
    
    return dir;
}

function loaddir(dir, path) {
    for (let name of fs.readdirSync(path)) {
        loadFile(dir, path, name);
    }
}

/*async */ function loadFile(dir, path, name) {
    const pathname = path + "/" + name;
    let file = fs.statSync(pathname);
    if (name.endsWith(".mjs")) {
//        let o = await import(pathname);
        dir[name] = null; //o.default;
    } else if (file.isDirectory(pathname)) {
        dir[name] = Object.create(null);
        dir[name][Symbol.for("dir")] = pathname;
        loaddir(dir[name], pathname);
    } else {
        dir[name] = null;
    }
}