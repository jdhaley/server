let pkg = {
    type$Factory: "/factory/Factory",
    Context: {
        forName: function(name) {
            if (name === "") return null;
            if (name.startsWith("/")) name = name.substring(1);
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
        type$: ["Factory", "Context"],
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
                    object = this.extend(type);
                    component[name] = object;
                    this.implement(object, value);
                    value = object;
                }
            }
            return value;
        }
    },
    Loader: {
        type$: "FactoryContext",
        extend$use: {
            type$Module: "/core/Module"
        },
        load: function(module) {
            for (let name in module.use) {
                module.package[name] = module.use[name][Symbol.for("dir")];
            }
            let ctx = this.extend(this);
            ctx.$context = module.package;
            module = ctx.extend(this.use.Module, module);
            delete module.package;
            ctx.implement(module, {
                forName: function(name) {
                    return ctx.forName(name);
                },
                extend: function(type, ext) {
                    return ctx.extend(type, ext);
                },
                symbol$dir: ctx.$context
            });
            console.log(module);
            return module;
        }
    }
}
export default pkg;