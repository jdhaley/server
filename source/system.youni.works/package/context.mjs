let pkg = {
	Context: {
        type$: "Factory",
        forName: function(name, fromName) {
			return this.resolve(this.$data, name, fromName);
		},
        resolve: function(component, name, fromName) {
            name = "" + name;
			let componentName = "";
			for (let propertyName of name.split("/")) {
				if (typeof component != "object") return error("is not an object.");
				if (!component[propertyName]) return error(`does not define "${propertyName}".`);
				component = this.getProperty(component, propertyName);
				componentName += "/" + propertyName;
			}
			return component;

			function error(msg) {
				let err = fromName ? `From "${fromName}"... ` : "For ";
				err += `name "${name}": "${componentName}" ` + msg;
				console.error(err);
			}
		},
        getProperty: function(component, name) {
            let value = component[name];
            if (this.isSource(value)) {
                let object = Object.create(this.prototypeOf(value));
                component[name] = object;
                this.implement(object, value);
                value = object;
            }
            return value;
        },
        prototypeOf: function(source) {
            let type;
            if (Object.getPrototypeOf(source) == Array.prototype) {
                type = this.use.Array;
            } else if (Object.getPrototypeOf(source) == Object.prototype) {
                type = source[this.typeProperty];
            } else {
                throw new TypeError("Value is not a source object or array.");
            }
            return type || this.use.Object;
        }
	}
}
export default pkg;