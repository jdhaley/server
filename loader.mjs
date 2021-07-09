import fs from "fs";
const dir = Object.create(null);

export default function loader(path) {
    try {
        load(path, dir);
    } catch (err) {
        console.log(err);
    }
    return function loader(req, res) {
        let content = dir;
        content = JSON.stringify(content);
        res.set("Content-Type", "text/plain");
        res.send(content);
    }

    function load(path, dir) {
        if (!dir) dir = Object.create(null);
        dir[Symbol.for("dir")] = path;
        loaddir(dir, "./" + path);
        
        return dir;
    }

    function loaddir(dir, path) {
        for (let name of fs.readdirSync(path)) {
            loadFile(dir, path, name);
        }
    }

    async  function loadFile(dir, path, name) {
        const pathname = path + "/" + name;
        let file = fs.statSync(pathname);
        if (name.endsWith(".mjs")) {
            try {
                let o = await import(pathname);
                dir[name] = doValue(o.default);
            } catch (err) {
                console.log(err);
                dir[name] = null;
            }
        } else if (file.isDirectory(pathname)) {
            dir[name] = Object.create(null);
            dir[name][Symbol.for("dir")] = pathname;
            loaddir(dir[name], pathname);
        } else {
            dir[name] = null;
        }
    }

    function doValue(value) {
        if (typeof value == "function") {
            return {
                type$: "function",
                value: value.toString()
            }
        }
        if (value && typeof value == "object") {
            let object = Object.create(null);
            for (let key in value) object[key] = doValue(value[key]);
            value = object
        }
        return value;
    }
}