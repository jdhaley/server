export default { 
    Factory: {
        //_owner: object
        conf: {
            facets: {
            },
            typeProperty: "type",
            type$arrayType: "/core/Array",
        },
        forName(name, fromName) {
            throw new Error(`Cannot resolve "${name}"`);
        },
        compile(source, name, component) {
            if (Object.getPrototypeOf(source) == Array.prototype) {
                let array = Object.create(this.conf.arrayType);
                if (component) component[name] = array;
                for (let ele of source) {
                    if (this.isSource(ele)) ele = this.compile(ele);
                    Array.prototype.push.call(array, ele);
                }
                return array;
            }
            let type = source[this.conf.typeProperty];
            let object = creat.call(this, type, name, component);
            if (this.isTypeName(name)) {
                object[Symbol.toStringTag] = name;
                object[Symbol.for("type")] = Object.create(object[Symbol.for("type")] || null);
                object[Symbol.for("owner")] = this._owner;
            }
            if (type && typeof type == "object" && Object.getPrototypeOf(type) == Array.prototype) {
                for (let i = 1; i < type.length; i++) {
                    this.implement(object, this.forName(type[i]));
                }
            }
            this.implement(object, source);
            return source.$public ? object.public : object;
    
            function creat(type, name, component) {
                if (type === undefined || type === "") {
                    type = null;
                } else if (Object.getPrototypeOf(type) == Array.prototype) {
                    type = this.forName(type[0]);
                 } else {
                    type = this.forName(type)
                }
                let object = Object.create(type);
                if (component) component[name] = object;
                return object;
            }
        },
        create(source) {
            if (arguments.length == 0) source = null;
    
            if (this.isSource(source)) {
                return this.compile(source);
            } else if (typeof source == "object") {
                return Object.create(source);
            } else if (source && typeof source == "string") {
                return Object.create(this.forName(source));
            }
    
            throw new TypeError(`Invalid argument "${source}" for object creation.`);
        },  
        implement(object, source) {
            //TODO determine the guards or defaults for the object arg.
            let objectType = this.isType(object) ? object[Symbol.for("type")] : null;

            if (typeof source == "string") {
                let from = this.forName(source);
                if (!from) throw new Error(`Type "${source}" not found.`);
                source = from;
            }
            if (this.isType(source)) {
                implementType(source[Symbol.for("type")]);
            } else if (source && Object.getPrototypeOf(source) == Object.prototype) {
                implementSource(source, this);
            } else {
                throw new TypeError("Declarations must be a source or type object.");
            }    
            function implementType(type) {
                for (let name in type) {
                    if (objectType) objectType[name] = type[name];
                    type[name].define(object);
                }
            }
            function implementSource(source, sys) {
                for (let decl in source) {
                    if (decl != sys.conf.typeProperty) {
                        decl = sys.declare(object, sys.nameOf(decl), source[decl], sys.facetOf(decl));
                        if (objectType) {
                            objectType[decl.name] = decl;
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
		declare(object, name, value, facet) {
            let fn = this.conf.facets[facet || "const"];
			if (!fn) throw new Error(`Facet "${facet}" does not exist.`);
            if (this.isSource(value)) {
                value = this.compile(value, name);
            }
            return fn.call(this, {
                declaredBy: object,
                facet: facet,
                name: name,
                expr: value
            });
		},
        define(object, name, value, facet) {
            return this.declare(object, name, value, facet).define(object);
		},
        symbolOf(key) {
            if (key == "iterator") return Symbol.iterator;
            return Symbol.for(key);
        },
        facetOf(decl) {
			if (typeof decl == "symbol") return "";
			decl = "" + decl;
			let index = decl.indexOf("$");
			return index < 0 ? "" : decl.substr(0, index);
		},
		nameOf(decl) {
			if (typeof decl == "symbol") return decl;
			decl = "" + decl;
			let index = decl.indexOf("$");
			return index < 0 ? decl : decl.substring(index + 1);
		},
        isSource(value) {
			return value && typeof value == "object" && (
                Object.getPrototypeOf(value) == Object.prototype ||
                Object.getPrototypeOf(value) == Array.prototype
            );
		},
        isType(value) {
            return value &&
                typeof value == "object" &&
                Object.prototype.hasOwnProperty.call(value, Symbol.for("type"))
        },
        isTypeName(name) {
            if (!name) return false;
            let first = name.substring(0, 1);
            return first == first.toUpperCase() && first != first.toLowerCase() ? true : false;
        }
    }
}