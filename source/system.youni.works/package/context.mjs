let pkg = {
    type$Factory: "/factory/Factory",
    Resolver: {
        resolve(component, pathname) {
            let componentName = "";
            for (let name of pathname.split("/")) {
                if (typeof component != "object") {
                    throw new Error(`Unable to resolve "${pathname}": "${componentName}" is not an object.`);
                }
                if (component[name] === undefined) {
                    throw new Error(`Unable to resolve "${pathname}": "${componentName || "/"}" does not contain "${name}".`);
                }
                component = this.resolveProperty(component, name);
                componentName += "/" + name;
            }
            return component;
        },
        resolveProperty(component, name) {
            return component[name];
        }
    },
    FactoryContext: {
        type$: ["Factory", "Resolver"],
                // _dir: {
        // },
        forName(pathname) {
            if (!pathname || typeof pathname != "string") {
                throw new Error(`Pathname must be a non-empty string.`);
            }
            if (pathname.startsWith("/")) pathname = pathname.substring(1);

            let object = this._dir;
            //TRIGGERS RECURSION
            // if (this.isSource(object)) {
            //     object = this.compile(object);
            //     this._dir = object;
            // }
            return this.resolve(object, pathname);
        },
        resolveProperty(component, name) {
            let value = component[name];
            if (this.isSource(value)) {
                if (Object.getPrototypeOf(value) == Array.prototype) {
                    value = this.create(value);
                } else {
                    let type = value[this.conf.typeProperty];
                    //TODO
                    if (type == "Function") {
                        //create the function from value.source
                    }
                    /*
                        Create the object from its prototype, put it in context, then implement
                        rather than just creating / extending before putting in context.
                        This way, forward/inner type references (then back-references) from properties
                        will resolve to the target object in the context rather than the source.
                    */
                    let object = this.creat(type);
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
                if (pkg[name]) console.error(`Package name "${name}" conflict with use "${name}"`);
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
        extend(from, source) {
            let object = this.creat(from);
            if (source) this.implement(object, source);
            return object;
        },
        createContext() {
            //Create a context and have its owner close over it.
            //To some degree, this logic assume a Module as owner.
            let ctx = this.creat(this);
            this.implement(ctx, {
                _owner: this.extend(this.conf.ownerType, {
                    forName: function(name) {
                        return ctx.forName(name);
                    },
                    create: function () {
                        switch (arguments.length) {
                            case 0:
                                return ctx.creat();
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