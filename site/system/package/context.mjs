const pkg = {
	Context: {
        facets: {
        },
        symbols: {
        },
        forName: function(name) {
			return this.getProperty(this.data, name);
		},
        getProperty: function(component, name) {
            let value = component[name];
            if (this.isSource(value)) {
                value = this.create(value, name, component);
            }
            return value;
        },
		isSource: function(value) {
			return value && typeof value == "object" &&
                Object.getPrototypeOf(value) == Object.prototype ||
                Object.getPrototypeOf(value) == Array.prototype;

		},
		create: function(source, name, target) {
			if (!this.isSource(source)) {
				throw new TypeError("Argument must be a source object or array.");
			}
            let object;
            if (Object.getPrototypeOf(source) == Array.prototype) {
                object = Object.create(this.use.Array);
                if (target) target[name] = object;
                for (let value of source) {
                    if (this.isSource(value)) value = this.create(source);
                    object.push(value);
                }
            } else {
                object = source.type$;
                if (typeof object == "string") object = this.forName(object);
                object = Object.create(object || null);
                if (target) target[name] = object;
                this.implement(object, source);    
            }
			return object;
		},
		implement: function(object, decls) {
            for (let decl of Object.getOwnPropertyNames(decls)) {
                let facet = this.facetOf(decl);
                let name = this.nameOf(decl);
                let value = decls[decl];
                if (name) {
                    if (facet != "source" && this.isSource(value)) value = this.create(value, name, object);
                    this.define(object, name, value, facet);
                }
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
        define: function(object, name, value, facet) {
            let decl = this.declare(object, name, value, facet);
            if (decl.define) {
                decl.define(object);
            } else {
                Reflect.defineProperty(object, decl.name, decl);
            }
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
		}
	}
}
export default pkg;