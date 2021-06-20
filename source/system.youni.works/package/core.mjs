const pkg = {
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
        toString() {
            return Object.prototype.toString.call(this);
        },
		valueOf() {
            return Object.prototype.valueOf.call(this);
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
    }
}
export default pkg;