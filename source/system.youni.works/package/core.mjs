const pkg = {
	Array: {
		var$length: 0,
		symbol$iterator: function *() {
			for (let i = 0; i < this.length; i++) yield this[i];
		}
	},
    Creator: {
        create: function() {
            let dir = this[Symbol.for("sys")];
            switch (arguments.length) {
                case 0:
                    return dir.extend();
                case 1:
                    let arg = arguments[0];
                    let isSource = dir.isSource(arg);
                    return isSource ? dir.extend(null, arg) : dir.extend(arg);
                case 2:
                    return dir.extend(arguments[0], arguments[1]);
                default:
                    console.warn("Create expects two arguments");
                    return dir.extend.apply(arguments);
            }
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
        name: "",
        version: "0.0.0",
        use: {
        },
        forName: function(name) {
        },
        extend: function(type, ext) {
        }
    }
}
export default pkg;