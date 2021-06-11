let pkg = {
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
        type$: ["/core/Factory", "Context"],
        getProperty: function(component, name) {
            let value = component[name];
            if (this.isSource(value)) {
                if (Object.getPrototypeOf(value) == Array.prototype) {
                    value = this.create(value);
                } else {
                    let object;
                    //Allow for forward/inner references creating the instance, putting in context, then implementing.
                    //TODO might be issues with screwy type decls.
                    let type = value[this.conf.typeProperty];
                    if (typeof type == "object" && type[this.conf.symbols.iterator]) {
                        object = this.instance.apply(this, type);
                    } else {
                        object = this.instance(type);
                    }
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
            if (name.startsWith("/")) {
                return this.resolve(this.$context, name.substring(1), fromName);
            }
            return this.resolve(this.$loading, name, fromName);
        },
        compile: function (pkgs) {
            this.$context = pkgs;
            for (let name in pkgs) {
                pkgs[name].$loading = true;
            }
            for (let name in pkgs);
        }
    }
}
export default pkg;