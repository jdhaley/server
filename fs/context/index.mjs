import facets from "./facets.mjs";

export default function main() {
    let ctx = createContext(this.sys, {
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
    });
    console.log(ctx.forName("y"));
    console.log(ctx.forName("y/c"));
}

let Context;
function createContext(sys, data) {
    if (!Context) {
        Context = sys.extend("/system.youni.works/context/Context", {
            facets: facets,
            symbols: sys.symbols,
            typeProperty: "class",    
        });
        Object.freeze(Context);
    }
    let ctx = sys.extend(Context);
    sys.define(ctx, "forName", function forName(name, fromName) {
        return this.resolve(data, name, fromName);
    }, "const");
    return ctx;
}