let pkg = {
    type$Factory: "/factory/Factory",
    Context: {
        // _dir: {
        // },
        forName(name) {
            if (name === "") return null;
            name = "" + name;
            return this.resolve(this._dir, name);
        },
        resolve(component, pathname) {
            pathname = "" + pathname;
            if (pathname.startsWith("/")) pathname = pathname.substring(1);
            let componentName = "";
            for (let name of pathname.split("/")) {
                if (typeof component != "object") {
                    throw new Error(`Unable to resolve "${pathname}": "${componentName}" is not an object.`);
                }
                if (component[name] === undefined) {
                    throw new Error(`Unable to resolve "${pathname}": "${componentName || "/"}" does not contain "${name}".`);
                }
                component = this.getProperty(component, name);
                componentName += "/" + name;
            }
            return component;
        },
        getProperty(component, name) {
            return component[name];
        }
    },
    FactoryContext: {
        type$: ["Factory", "Context"],
        getProperty(component, name) {
            let value = component[name];
            if (this.isSource(value)) {
                if (Object.getPrototypeOf(value) == Array.prototype) {
                    value = this.create(value);
                } else {
                    let type = value[this.conf.typeProperty];
                    /*
                        Create the object from its prototype, put it in context, then implement
                        rather than just creating / extending before putting in context.
                        This way, forward/inner type references (then back-references) from properties
                        will resolve to the target object in the context rather than the source.
                    */
                    let object = this.extend(type);
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
        extend$conf: {
            type$ownerType: "/core/Module"
        },
        load(source) {
            let pkg = source.package;
            for (let name in source.use) {
                pkg[name] = source.use[name].package
            }
            delete source.package;
            let ctx = this.createContext();
            ctx._dir = pkg;
            ctx._dir = ctx.compile(pkg); //make sure everything is compiled
            let module = ctx._owner;
            ctx.implement(module, source);
            console.log(module);
            return module;
        },
        createContext() {
            //Create a context and have its owner close over it.
            //To some degree, this logic assume a Module as owner.
            let ctx = this.extend(this, {
                _owner: this.extend(this.conf.ownerType, {
                    create: function () {
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
                    define: function (object, name, value, facet) {
                        return ctx.define(object, name, value, facet);
                    },
                    get$package: function () {
                        return ctx._dir;
                    }
                })
            });
            return ctx;
        }   
    }
}
export default pkg;