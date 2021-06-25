export default { 
    Devt_System: {
        type$conf: "Devt_FactoryClass",
        symbolOf: function(key) {
            if (key == "iterator") return Symbol.iterator;
            return Symbol.for(key);
        },
        create: function(...sources) {
        },
        implement: function(object, ...sources) {
        },
        declare: function(object, name, value, facet) {
        }
    },
    FactoryConf: {
        typeProperty: "type",
        facets: {
        },
        type$arrayType: "/core/Array",
        type$ownerType: "/core/Module"
    },
    Factory: {
        type$conf: "FactoryConf",
        //_owner: object
        forName(name, fromName) {
        },
        symbolOf(key) {
            if (key == "iterator") return Symbol.iterator;
            return Symbol.for(key);
        },
        compile(value) {
            if (!value || typeof value != "object") return value;
            if (!this._dir) {
                let compiler = Object.create(this);
                compiler._dir = value;
                return compiler.compile(value);
            }
            if (Object.getPrototypeOf(value) == Array.prototype) {
                let array = this.extend(this.conf.arrayType);
                for (let ele of value) {
                    ele = this.compile(ele);
                    Array.prototype.push.call(array, ele);
                }
                return array;
            } else if (Object.getPrototypeOf(value) == Object.prototype) {
                let object = this.extend(value[this.conf.typeProperty], value);
                if (value.$public) {
                    object = object.public;
                }
                return object;
            } else {
                return value;
            }
        },
        extend(type, source) {
            let args = [];
            if (type && typeof type == "object" && type[Symbol.iterator]) {
                let i = 0;
                for (let arg of type) {
                    if (!i) type = arg; else args[i] = arg;
                    i++;
                }
            }
            type = (typeof type == "string" ? this.forName(type) : type) || null;
            let target = Object.create(type);
            args[0] = target;
            if (source && source[Symbol.toStringTag]) {
                this.defineClass(target, source[Symbol.toStringTag], type && type[Symbol.for("type")]);
            }
            if (source) args.push(source);
            if (args.length > 1) this.implement.apply(this, args);
            return target;
        },
        implement(object, ...sources) {
            //TODO determine the guards or defaults for the object arg.
            let objectType = this.isType(object) ? object[Symbol.for("type")] : null;
            for (let source of sources) {
                if (typeof source == "string") source = this.forName(source);
                if (this.isType(source)) {
                    implementType(source[Symbol.for("type")]);
                } else if (source && (Object.getPrototypeOf(source) == Object.prototype || !source[Symbol.for("type")])) {
                    implementObject(source, this);
                } else {
                    throw new TypeError("Declarations must be a source, simple object, or class.");
                }
            }
            function implementType(type) {
                for (let name in type) {
                    if (objectType) objectType[name] = type[name];
                    type[name].define(object);
                }
            }
            function implementObject(source, sys) {
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
            if (this.isSource(value) && this.isTypeName(name)) {
                //Signal to create a type:
                value[Symbol.toStringTag] = name;
            }
            //Facets are now responsible to compile the expr (extend$ needs the source object)
            //value = this.compile(value);
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
        defineClass(object, name, supertype) {
            object[Symbol.toStringTag] = name;
            object[Symbol.for("type")] = Object.create(supertype || null);
            object[Symbol.for("owner")] = this._owner;
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
            let first = name.substring(0, 1);
            return first == first.toUpperCase() && first != first.toLowerCase() ? true : false;
        }
    }
}