let pkg = {
    type$Factory: "/core/Factory",
	Context: {
        forName: function(name, fromName) {
			return this.resolve(this.$context, name, fromName);
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
            return component[name];
        }
	},
    FactoryContext: {
        type$: ["Factory", "Context"],
        getProperty: function(component, name) {
            let value = component[name];
            if (this.isSource(value)) {
                if (Object.getPrototypeOf(value) == Array.prototype) {
                    value = this.create(value);
                } else {
                    //Allow for forward/inner references...
                    //TODO might be issues with screwy type decls.
                    let object = this.instance(value[this.conf.typeProperty]);
                    component[name] = object;  
                    this.implement(object, value);  
                    value = object;
                }  
            }
            return value;
        }
    },
    ModuleContext: {
        type$: "FactoryContext",
        forName: function(name, fromName) {
            let context = this.packages;
            let idx = name.indexOf(":");
            if (idx >= 0) {
                context = this.use[name.substring(0, index)];
                name = name.substring(index + 1);
                if (name.startsWith("/")) name = name.substring(1);
            } else if (name.startsWith("/")) {
                name = name.substring(1);
            } else {
                context = this.$loading;
            }
            return this.resolve(context, name, fromName);
       }
    }
}
export default pkg;