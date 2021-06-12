const pkg = {
	Array: {
		var$length: 0,
		symbol$iterator: function *() {
			for (let i = 0; i < this.length; i++) yield this[i];
		}
	},
	Declaration: {
        define: function(object) {
            Reflect.defineProperty(object, this.name, this);
        }
    },
    Namespace: {
        forName: function(name, fromName) {
            if (name === "") return null;
		}
    },
    Instance: {
        get$sys: function() {
            return this[Symbol.for("sys")];
        },
		let: function(name, value, facet) {
			if (!facet) facet = "const";
			if (facet == "var") facet = "";
			this[Symbol.for("sys")].define(this, name, value, facet);
		},
        extend: function(decls) {
            return this[Symbol.for("sys")].extend(this, decls);
        }
    },
    Factory: {
        type$: "Namespace",
        use: {
            type$Object: "",
            type$Array: "Array",
            type$Declaration: "Declaration"
        },
        conf: {
            facets: null,
            symbols: null,
            typeProperty: "type"
        },
        forName: function(name, fromName) {
            if (name === "") return null;
            if (this.$context[name] === undefined) {
                throw new Error(`"${name}" is not defined.`);
            }
            return this.$context[name];
        },
        create: function(source) {
            if (Object.getPrototypeOf(source) == Array.prototype) {
                let array = this.instance(this.use.Array);
                for (let value of source) {
                    if (this.isSource(value)) value = this.create(value);
                    Array.prototype.push.call(array, value);
                }
                return array;
            } else if (Object.getPrototypeOf(source) == Object.prototype) {
                let object = this.extend(source[this.conf.typeProperty], source);
                if (source.$public) {
                    object = object.public;
                }
                return object;
             }
            throw new TypeError("Value is not a source object or array.");
        },
        extend: function(type, source) {
            let object;
            if (type && typeof type == "object" && type[Symbol.iterator]) {
                object = this.instance.apply(this, type);
            } else {
                object = this.instance(type || null);
            }
            if (source === undefined) return object;
            if (source[Symbol.toStringTag]) {
                object[Symbol.toStringTag] = source[Symbol.toStringTag];
                object[Symbol.for("decls")] = this.instance();
                object[Symbol.for("sys")] = this;
            }
            this.implement(object, source);
            return object;
        },
        instance: function() {
            let object = Object.create(getType(this, arguments[0]));
            for (let i = 1; i < arguments.length; i++) {
                this.implement(object, getType(this, arguments[i]));
            }
            return object;

            function getType(ns, type) {
                return typeof type == "string" ? ns.forName(type) : (type || null);
            }
        },
        implement: function(object, source) {
            let cls = this.isType(object) ? object[Symbol.for("decls")] : null;
            if (this.isType(source)) {
                source = source[Symbol.for("decls")];
                for (let name in source) {
                    let decl = source[name];
                    if (cls) cls[name] = decl;
                    decl.define && decl.define(object) || Reflect.defineProperty(object, decl.name, decl);
                }
            } else if (source && Object.getPrototypeOf(source) == Object.prototype) {
                for (let decl of Object.getOwnPropertyNames(source)) {
                    def.call(this, decl, source[decl]);
                }
            } else {
                throw new TypeError("Declarations must be a source or type object.");
            }

            function def(decl, value) {
                if (decl == this.conf.typeProperty) return;
                decl = this.declare(this.nameOf(decl), value, this.facetOf(decl));
                if (cls) {
                    decl.declaredBy = object;
                    decl = this.extend(this.use.Declaration, decl);
                    cls[decl.name] = decl;
                }
                let defined = decl.define ? decl.define(object) : Reflect.defineProperty(object, decl.name, decl);
                if (!defined) console.warn("Unable to define declaration: ", decl);
            }
		},
		declare: function(name, value, facet) {
            let fn = this.conf.facets[facet || "const"];
			if (!fn) throw new Error(`Facet "${facet}" does not exist.`);
            if (this.isSource(value)) {
                if (this.isTypeName(name)) {
                    //Signal to create a type:
                    value[Symbol.toStringTag] = name;
                }
                value = this.create(value, name);
            }
           return fn.call(this, {
                sys: this,
                facet: facet,
                name: name,
                expr: value
            });
		},
        define: function(object, name, value, facet) {
            let decl = this.declare(name, value, facet);
            decl.define ? decl.define(object) : Reflect.defineProperty(object, decl.name, decl);
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
			return value && typeof value == "object" && (
                Object.getPrototypeOf(value) == Object.prototype ||
                Object.getPrototypeOf(value) == Array.prototype
            );
		},
        isType: function(value) {
            return value &&
                typeof value == "object" &&
                Object.prototype.hasOwnProperty.call(value, Symbol.for("decls"))
        },
        isTypeName: function(name) {
            let first = name.substring(0, 1);
            return first == first.toUpperCase() && first != first.toLowerCase() ? true : false;
        }
    }
}
export default pkg;