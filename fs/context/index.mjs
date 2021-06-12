import facets from "./facets.mjs";
import util from "/prd/base/package/util.mjs";
import compile from "./compile.mjs";
let state;
export default function main() {
    let data = {
        "type$base.youni.works": "/base.youni.works",
        b: util,
        x: {
            a: 10,
            b: 20,
            type$y: "y"
        },
        y: {
            class: "x",
            b: 30,
            c: 50
        }
    };
    let ctx = createContext(this.sys, data);
    console.log(ctx.forName("y/c"));
    console.log(state);
    console.log(compile(util, "util"));
}
let Context;
function createContext(sys, data) {
    if (!Context) {
        Context = sys.extend("/system.youni.works/context/Context", {
            sys: sys,
            facets: facets,
            symbols: sys.symbols,
            typeProperty: "class",    
        });
        Object.freeze(Context);
    }
    let ctx = sys.extend(Context);

    state = Object.create(null);
    sys.define(ctx, "forName", function forName(name, fromName) {
        name = "" + name;
        if (name.startsWith("/")) return sys.forName(name, fromName);
        return this.resolve(state, name, fromName);
    }, "const");
    for (let decl in data) {
        let facet = ctx.facetOf(decl);
        let name = ctx.nameOf(decl);
        ctx.define(state, name, data[decl], facet);
    }
    return ctx;
}