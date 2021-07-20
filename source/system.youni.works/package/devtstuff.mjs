const pkg = {
    implement(object, source) {
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
	Array: {
		var$length: 0,
		symbol$iterator: function *() {
			for (let i = 0; i < this.length; i++) yield this[i];
		}
	},
    Instance: {
		let: function(name, value, facet) {
			if (!facet) facet = "const";
			if (facet == "var") facet = "";
			this[Symbol.for("owner")].define(this, name, value, facet);
		},
        super: function(method, ...args) {
			if (method && typeof method == "function") {
				if (method.$super) return method.$super.apply(this, args);
				console.error(`super("${method.name}" ...) is not a method.`);
				return;
			}
			throw new TypeError("Invalid method argument.");
		},
        perform: function(name, ...args) {
			let method = this[Symbol.for("owner")].forName(name);
			return method.apply(this, args);
        },
        toString() {
            return Object.prototype.toString.call(this);
        },
		valueOf() {
            return Object.prototype.valueOf.call(this);
        }
    },
    Devt_Owner: {
        forName(name) {
            return this[Symbol.for("owner")].forName(name);
        },
        /**
         * @param from The prototype, a source declaration, or a type string.
         * @returns object
         */
        create(from) {
            return this[Symbol.for("owner")].create(from);
        }
    },
    Context: {
        /*
            Return the same instance or a new instance each time.
            A context doesn't support declarations / configuration arguments -
            Those dependencies are "configured in".
        */
        forName(name) {
        }
    },
    Factory: {
        create() {
            let module = this[Symbol.for("owner")];
            return module.create.apply(module, arguments);
        }
    },
    Component: {
        forName(name) {
        },
        create(from) {
        },
        implement(object, ...source) {
        },
        define(object, name, value, facet) {
        }
    },
    Module: {
        type$: "Factory",
        name: "",
        version: "0.0.0",
        use: {
        },
        package: {
        },
        define(object, name, value, facet) {
        }
    },
    F2: {
        facets: {
        },
        create(...sources) {
            return null;
        },
        implement(object, ...sources) {
        },
        declare(object, name, value, facet) {
            return null;
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
            let first = name.substring(0, 1);
            return first == first.toUpperCase() && first != first.toLowerCase() ? true : false;
        },
    }
}
export default pkg;