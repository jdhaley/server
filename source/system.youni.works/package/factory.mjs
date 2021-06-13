export default { 
    Factory: {
        use: {
            type$Object: "",
            type$Array: "/core/Array"
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
            if (source === undefined || source === null) return Object.create(null);
            if (Object.getPrototypeOf(source) == Array.prototype) {
                let array = this.extend(this.use.Array);
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
            let args = [];
            if (type && typeof type == "object" && type[Symbol.iterator]) {
                let i = 0;
                for (let arg of type) {
                    if (!i) type = arg; else args[i] = arg;
                    i++;
                }
            }
            type = (typeof type == "string" ? this.forName(type) : type) || null;
            let object = Object.create(type);
            args[0] = object;
            if (source && source[Symbol.toStringTag]) {
                object[Symbol.for("sys")] = this;
                object[Symbol.toStringTag] = source[Symbol.toStringTag];
                object[Symbol.for("decls")] = Object.create(type && type[Symbol.for("decls")] || null);
            }
            if (source) args.push(source);
            if (args.length > 1) this.implement.apply(this, args);
            return object;
        },
        implement: function(object, ...sources) {
            let cls = this.isType(object) ? object[Symbol.for("decls")] : null;
            for (let source of sources) {
                if (typeof source == "string") source = this.forName(source);
                if (this.isType(source)) {
                    implementInterface(source);
                } else if (source && Object.getPrototypeOf(source) == Object.prototype) {
                    implementSource(source, this);
                } else {
                    throw new TypeError("Declarations must be a source or type object.");
                }    
            }
            function implementInterface(type) {
                type = type[Symbol.for("decls")];
                if (type) for (let name in type) {
                    let decl = type[name];
                    if (cls) cls[name] = decl;
                    decl.define(object);
                }
            }
            function implementSource(source, sys) {
                for (let decl in source) {
                    if (decl != sys.conf.typeProperty) {
                        decl = sys.declare(sys.nameOf(decl), source[decl], sys.facetOf(decl));
                        if (cls) {
                            decl.declaredBy = object;
                            cls[decl.name] = decl;
                        }
                        if (!decl.define(object)) {
                            console.warn("Unable to define declaration: ", decl);
                        }
                        if (decl.facet === "" && typeof decl.expr == "function") {
                            decl.expr.$super = getSuper(object, decl.name);
                        }
                    }
                }
            }

            function getSuper(object, name) {
                if (!object) return;
                const sub = object[name];
                const OGP = Object.getPrototypeOf;
                if (sub) for (object = OGP(object); object; object = OGP(object)) {
                    let sup = object[name];
                    if (sup !== sub) return sup;
                }
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