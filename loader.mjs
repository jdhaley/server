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
        content = JSON.stringify({
            [path]: content
        });
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
        dir.facet = "folder";
        dir.expr = Object.create(null);
        for (let name of fs.readdirSync(path)) {
            loadFile(dir.expr, path, name);
        }
    }

    async  function loadFile(dir, path, name) {
        const pathname = path + "/" + name;
        let file = fs.statSync(pathname);
        if (name.endsWith(".mjs")) {
            try {
                let o = await import(pathname);
                dir[name] = {
                    facet: "package",
                    expr: membersFor(o.default)
                }
            } catch (err) {
                console.log(err);
                dir[name] = null;
            }
        } else if (file.isDirectory(pathname)) {
            dir[name] = Object.create(null);
            dir[name][Symbol.for("dir")] = pathname;
            loaddir(dir[name], pathname);
        } else {
            dir[name] = {
                facet: "file"
            }
        }
    }

    function facetOf(decl) {
        if (typeof decl == "symbol") return "";
        decl = "" + decl;
        let index = decl.indexOf("$");
        return index < 0 ? "" : decl.substr(0, index);
    }
    function nameOf(decl) {
        if (typeof decl == "symbol") return decl;
        decl = "" + decl;
        let index = decl.indexOf("$");
        return index < 0 ? decl : decl.substring(index + 1);
    }
    function memberFor(expr, name, facet) {
        let member = Object.create(null);
        member.facet  = facet;
        if (typeof expr == "function") {
            if (!facet) member.facet = "method";
            member.expr = expr.toString();
        } else if (expr && typeof expr == "object") {
            //TODO check if array.
            member.expr = membersFor(expr);
        } else {
            member.expr = expr;
        }
        return member;

    }
    function membersFor(source) {
        let members = Object.create(null);
        for (let decl in source) {
            let name = nameOf(decl);
            let member = memberFor(source[decl], name, facetOf(decl));
            members[name] = member;
        }
        return members;
    }
}