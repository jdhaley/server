let pkg = {
    type$Factory: "/factory/Factory",
    Context: {
        // _dir: {
        // },
        forName: function(name) {
            if (name === "") return null;
            if (name.startsWith("/")) name = name.substring(1);
            return this.resolve(this._dir, name);
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
        defineClass: function(object, name, supertype) {
            object[Symbol.toStringTag] = name;
            object[Symbol.for("type")] = Object.create(supertype || null);
            object[Symbol.for("sys")] = this._module;
        },        
        load: function(source) {
            let pkg = source.package;
            for (let name in source.use) {
                pkg[name] = source.use[name].package
            }
            delete source.package;
            let ctx = this.extend(this, {
                 _module: this.extend(this.use.Module, {
                    create: function() {
                        switch (arguments.length) {
                            case 0:
                                return ctx.extend();
                            case 1:
                                let arg = arguments[0];
                                let isSource = ctx.isSource(arg);
                                return isSource ? ctx.extend(null, arg) : ctx.extend(arg);
                            case 2:
                                return ctx.extend(arguments[0], arguments[1]);
                            default:
                                console.warn("Create expects two arguments");
                                return ctx.extend.apply(arguments);
                        }        
                    },
                    define: function(object, name, value, facet) {
                        return ctx.define(object, name, value, facet);
                    },           
                    get$package: function() {
                        return ctx._dir;
                    }
                })
            });
            ctx._dir = pkg;
            ctx._dir = ctx.create(pkg); //make sure everything is compiled
            let module = ctx._module;
            ctx.implement(module, source);
            console.log(module);
            return module;
        }
    }
}
export default pkg;