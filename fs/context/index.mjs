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
}

function createContext(sys, data) {
    let ctx = sys.forName("/system.youni.works/context/FactoryContext");
    ctx = sys.extend(ctx, {
        facets: facets,
        symbols: sys.symbols,
        typeProperty: "class",
        forName: function(name) {
			return this.getProperty(data, name);
		}
    });
    return Object.freeze(ctx);
}