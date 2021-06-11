let pkg = {
    Context: {
        forName: function(name) {
            return this.resolve(this.$context, name);
        },
        resolve: function(component, pathname) {
            pathname = "" + pathname;
            let componentName = "";
            for (let name of pathname.split("/")) {
                if (typeof component != "object") {
                    throw new Error(`Unable to resolve "${pathname}": "${componentName}" is not an object.`);
                }
                if (component[name] === undefined) {
                    throw new Error(`Unable to resolve "${pathname}": "${componentName}" does not contain "${name}".`);
                }
                if (component.$loading) this.$loading = component;
                component = this.getProperty(component, name);
                componentName += "/" + name;
            }
            return component;
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
            for (let name in pkgs) {
                pkgs[name]["/"] = this.$context;
            }
            for (let name in pkgs) {
                this.forName("/" + name);
            }
        }
    }
}
export default pkg;