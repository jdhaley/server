export default { 
    Resolver: {
        resolve(object, pathname) {
            pathname = "" + pathname;
            if (pathname === "") return null;
            if (pathname.startsWith("/")) pathname = pathname.substring(1);

            let componentName = "";
            for (let name of pathname.split("/")) {
                if (typeof object != "object") {
                    throw new Error(`Unable to resolve "${pathname}": "${componentName}" is not an object.`);
                }
                if (object[name] === undefined) {
                    throw new Error(`Unable to resolve "${pathname}": "${componentName || "/"}" does not contain "${name}".`);
                }
                object = this.resolveProperty(object, name);
                componentName += "/" + name;
            }
            return object;
        },
        resolveProperty(object, name) {
            return object[name];
        }
    },
    FactoryResolver: {
        type$: "Resolver",
        // _dir: {
        // },
        resolveProperty(object, name) {
            let value = object[name];
            if (!this.isSource(value)) return value;
            if (Object.getPrototypeOf(value) == Array.prototype) {
                value = this.create(value);
            }
            if (Object.getPrototypeOf(value) == Array.prototype) {
                let array = this.creat(this.conf.arrayType);
                for (let ele of value) {
                    ele = this.compile(ele);
                    Array.prototype.push.call(array, ele);
                }
                return array;
            }
            else {
                let type = value[this.conf.typeProperty];
                //TODO
                if (type == "Function") {
                    //create the function from value.source
                }
                /*
                    Create the object from its prototype, put it in context, then implement
                    rather than just creating / extending before putting in context.
                    This way, forward/inner type references (then back-references) from properties
                    will resolve to the target object in the context rather than the source.
                */
                let object = this.creat(type);
                object[name] = object;
                this.implement(object, value);
                value = object;
            }

            if (this.isSource(value)) {
            }
            return value;
        }
    },
    Factory: {
        type$: "FactoryResolver",
        conf: {
            facets: {
            },
            typeProperty: "type",
            type$arrayType: "/core/Array",
        },
        //_owner: object
        forName(pathname) {
            if (!pathname || typeof pathname != "string") {
                throw new Error(`Pathname must be a non-empty string.`);
            }
            if (pathname.startsWith("/")) pathname = pathname.substring(1);

            let object = this._dir;
            if (this.isSource(object)) {
                object = this.compile(object);
                this._dir = object;
            }
            return this.resolve(object, pathname);
        },
        compile(value, typeName) {
            if (!value || typeof value != "object") {
                return value;
            } else if (Object.getPrototypeOf(value) == Array.prototype) {
                let array = this.creat(this.conf.arrayType);
                for (let ele of value) {
                    ele = this.compile(ele);
                    Array.prototype.push.call(array, ele);
                }
                return array;
            } else if (Object.getPrototypeOf(value) == Object.prototype) {
                let object = this.creat(value[this.conf.typeProperty]);
                typeName && this.defineClass(object, typeName);
                this.implement(object, value);
                if (value.$public) {
                    object = object.public;
                }
                return object;
            } else {
                return value;
            }
        },
        creat(from) {
            let args = [];
            if (from && typeof from == "object" && from[Symbol.iterator]) {
                let i = 0;
                for (let arg of from) {
                    if (!i) from = arg; else args[i] = arg;
                    i++;
                }
            }
            from = (typeof from == "string" ? this.forName(from) : from) || null;
            let target = Object.create(from);
            args[0] = target;
            if (args.length > 1) this.implement.apply(this, args);
            return target;
        },
        implement(object, ...sources) {
            //TODO determine the guards or defaults for the object arg.
            let objectType = this.isType(object) ? object[Symbol.for("type")] : null;
            for (let source of sources) {
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
            value = this.compile(value, this.typeNameOf(name));
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
        defineClass(object, name) {
            object[Symbol.toStringTag] = name;
            object[Symbol.for("type")] = Object.create(object[Symbol.for("type")] || null);
            object[Symbol.for("owner")] = this._owner;
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
        typeNameOf(name) {
            let first = name.substring(0, 1);
            return first == first.toUpperCase() && first != first.toLowerCase() ? name : "";
        }
    }
}