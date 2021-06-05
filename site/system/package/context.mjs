const pkg = {
    type$: "/system.youni.works/core",
    Context: {
        forName: function(name) {
			return this.sys.forName(name);
		}
    },
    Factory: {
        use: {
            type$Object: "",
            type$Array: "Array"
        },
        type$facets: "Parcel",
        type$symbols: "Parcel",
        type$context: "Context",
        create: function(value) {
            return this.extend(this.prototypeOf(value), value);
        },
        extend: function(object, source) {
            object = Object.create(object);
            this.implement(object, source);
            return object;
        },
        implement: function(object, source) {
            if (Object.getPrototypeOf(source) == Array.prototype) {
                for (let value of source) {
                    if (this.isSource(value)) value = this.create(value);
                    Array.prototype.push.call(object, value);
                }
            } else if (Object.getPrototypeOf(source) == Object.prototype) {
                for (let decl of Object.getOwnPropertyNames(source)) {
                    let facet = this.facetOf(decl);
                    let name = this.nameOf(decl);
                    if (decl != this.typeProperty) {
                        let value = source[decl];
                        if (facet != "source" && this.isSource(value)) value = this.create(value);
                        this.define(object, name, value, facet);
                    }
                }
            } else {
                throw new TypeError("Value is not a source object or array.");
            }
		},
        define: function(object, name, value, facet) {
            let decl = this.declare(object, name, value, facet);
            if (decl.define) {
                decl.define(object);
            } else {
                Reflect.defineProperty(object, decl.name, decl);
            }
		},
		declare: function(object, name, value, facet) {
            let fn = this.facets[facet || "default"];
			if (!fn) throw new Error(`Facet "${facet}" does not exist.`);
            return fn.call(this, {
                declaredBy: object,
                facet: facet,
                name: name,
                expr: value
            });
		},
        prototypeOf: function(source) {
            let type;
            if (Object.getPrototypeOf(source) == Array.prototype) {
                type = this.use.Array;
            } else if (Object.getPrototypeOf(source) == Object.prototype) {
                type = source[this.typeProperty];
                if (typeof type == "string") type = this.context.forName(type);
            } else {
                throw new TypeError("Value is not a source object or array.");
            }
            return type || this.use.Object;
        },
        facetOf: function(decl) {
			if (typeof decl == "symbol") return "";
			decl = "" + decl;
			let index = decl.indexOf("$");
			return index < 0 ? "" : decl.substr(0, index);
		},
		nameOf: function(decl) {
			if (typeof decl == "symbol") return decl;
			decl = "" + decl;
			let index = decl.indexOf("$");
			return index < 0 ? decl : decl.substring(index + 1);
		},
        isSource: function(value) {
			return value && typeof value == "object" &&
                Object.getPrototypeOf(value) == Object.prototype ||
                Object.getPrototypeOf(value) == Array.prototype;

		}
    },
    Store: {
        get: function(id) {
            return this.data[id];
        },
        put: function(id, value) {
            this.data[value.id] = value;
        }
    },
	FactoryContext: {
        type$: ["Factory", "Context"],
        get$context: function() {
            return this;
        },
        forName: function(name) {
			return this.getProperty(this.data, name);
		},
        getProperty: function(component, name) {
            let value = component[name];
            if (this.isSource(value)) {
                let object = Object.create(this.prototypeOf(value));
                component[name] = object;
                this.implement(object, value);
                value = object;
            }
            return value;
        }
	}
}
export default pkg;