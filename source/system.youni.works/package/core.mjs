const pkg = {
	Array: {
		var$length: 0,
		symbol$iterator: function *() {
			for (let i = 0; i < this.length; i++) yield this[i];
		}
	},
    Factory: {
        create: function() {
            let module = this[Symbol.for("sys")];
            return module.create.apply(module, arguments);
        }
    },
    Instance: {
		let: function(name, value, facet) {
			if (!facet) facet = "const";
			if (facet == "var") facet = "";
			this[Symbol.for("sys")].define(this, name, value, facet);
		},
        super: function(method, ...args) {
			if (method && typeof method == "function") {
				if (method.$super) return method.$super.apply(this, args);
				console.error(`super("${method.name}" ...) is not a method.`);
				return;
			}
			throw new TypeError("Invalid method argument.");
		},
        toString: function() {
            return Object.prototype.toString.call(this);
        },
		valueOf: function() {
            return Object.prototype.valueOf.call(this);
        }
    },
    Module: {
        type$: "Factory",
        name: "",
        version: "0.0.0",
        use: {
        }
    }
}
export default pkg;