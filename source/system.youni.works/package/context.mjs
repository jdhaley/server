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
       forName(pathname) {
            if (!pathname || typeof pathname != "string") {
                throw new Error(`Pathname must be a non-empty string.`);
            }
            if (pathname.startsWith("/")) pathname = pathname.substring(1);
            return this.resolve(this._dir, pathname);
        },
        resolveProperty(component, name) {
            let value = component[name];
            if (this.isSource(value)) {
                value = this.compile(value, name, component);
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
            let object = this.create(from);
            if (source) this.implement(object, source);
            return object;
        },
        createContext() {
            //Create a context and have its owner close over it.
            //To some degree, this logic assume a Module as owner.
            let ctx = this.create(this);
            this.implement(ctx, {
                _owner: this.extend(this.conf.ownerType, {
                    forName: function(name) {
                        return ctx.forName(name);
                    },
                    create: function () {
                        switch (arguments.length) {
                            case 0:
                                return ctx.create();
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