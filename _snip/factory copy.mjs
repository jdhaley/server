export default { 
    F2: {
        conf: {
            facets: {
            }
        },
        symbolOf: function(key) {
            if (key == "iterator") return Symbol.iterator;
            return Symbol.for(key);
        },
        create: function(...sources) {
        },
        implement: function(object, ...sources) {
        },
        define: function(object, name, value, facet) {
        }
    },
    Factory: {
        use: {
            type$Object: "",
            type$Array: "/core/Array"
        },
        conf: {
            facets: null,
            typeProperty: "type"
        },
        symbolOf: function(key) {
            if (key == "iterator") return Symbol.iterator;
            return Symbol.for(key);
        },
        forName: function(name, fromName) {
        },
        _getPrototypeOf: function(source) {
            let type = source[this.conf.typeProperty];
            if (this.isSource(type, Array)) type = type[0];
            if (typeof type == "string") type = this.forName(type);
            return type || null;
        },
        _extendSource: function(target, source) {
            let type = source[this.conf.typeProperty];
            if (this.isSource(type, Array)) {
                let args = type.slice();
                args[0] = target;
                args.push(source);
                this.implement.apply(this, args);
            } else {
                this.implement(target, source);
            }
        },
        compile: function(value, name, object) {
            if (this.isSource(value, Array)) {
                let array = Object.create(this.use.Array);
                for (let ele of value) {
                    ele = this.compile(ele);
                    Array.prototype.push.call(array, ele);
                }
                return array;
            } else if (this.isSource(value, Object)) {
                let proto = this._getPrototypeOf(value);
                let target = Object.create(proto);
                if (name) {
                    this.define(object, name, target, "var");
                   // object[name] = target;
                    if (this.isTypeName(name)) this.defineClass(target, name, proto);
                }
                this._extendSource(target, value);
                return target;
            }
            return value;
        },
        create: function(/*...sources*/) {
            if (!arguments.length) return Object.create(null);
            let object = arguments[0];
            if (this.isSource(object)) {
                object = this.compile(object);
            } else if (typeof object == "string") {
                object = Object.create(this.forName(object));
            } else if (typeof object == "object") {
                object = Object.create(object);
            } else {
                throw new TypeError("Cannot create object: First argument is not an object or type string.");
            }
            arguments[0] = object;
            this.implement.apply(this, arguments);
            return object;
        },
        implement: function(object, ...sources) {
            //TODO determine the guards or defaults for the object arg.
            let objectType = this.isType(object) ? object[Symbol.for("type")] : null;
            for (let source of sources) {
                if (typeof source == "string") source = this.forName(source);
                if (this.isType(source)) {
                    implementType(source[Symbol.for("type")], this);
                } else if (source && Object.getPrototypeOf(source) == Object.prototype) {
                    implementSource(source, this);
                } else {
                    throw new TypeError("Declarations must be a source or type object.");
                }                          
            }
            function implementType(type, sys) {
                for (let name in type) {
                    if (objectType) sys.define(objectType, name, type[name]);
                    type[name].define(object);
                }
            }
            function implementSource(source, sys) {
                for (let decl in source) {
                    if (decl != sys.conf.typeProperty) {
                        decl = sys.declare(object, sys.nameOf(decl), source[decl], sys.facetOf(decl));
                        if (objectType) {
                            sys.define(objectType, decl.name, decl);
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
		declare: function(object, name, value, facet) {
            let fn = this.conf.facets[facet || "const"];
			if (!fn) throw new Error(`Facet "${facet}" does not exist.`);
            value = this.compile(value, name, object);
            return fn.call(this, {
                sys: this,
                facet: facet,
                name: name,
                expr: value
            });
		},
        define: function(object, name, value, facet) {
            let decl = this.declare(object, name, value, facet);
            decl.define(object);
		},
        defineClass: function(object, name, supertype) {
            object[Symbol.toStringTag] = name;
            object[Symbol.for("type")] = Object.create(supertype || null);
            object[Symbol.for("owner")] = this._owner;
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
        isSource: function(value, type) {
			if (value && typeof value == "object") {
                if (type) return typeOf(value, type);
                return typeOf(value, Object) || typeOf(value, Array);
            }
            return false;
            function typeOf(value, type) {
                return Object.getPrototypeOf(value) == type.prototype;
            }
		},
        isType: function(value) {
            return value &&
                typeof value == "object" &&
                Object.prototype.hasOwnProperty.call(value, Symbol.for("type"))
        },
        isTypeName: function(name) {
            let first = name.substring(0, 1);
            return first == first.toUpperCase() && first != first.toLowerCase() ? true : false;
        }
    }
}