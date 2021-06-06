import facets from "./facets.mjs";
import base from "/prd/base/index.mjs";
let state;
export default function main() {
    let data = {
        type$base: "/base.youni.works",
        b: base.packages,
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