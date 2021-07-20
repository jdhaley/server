let pkg = {
    type$Factory: "/factory/Factory",
    compile(source, name, component) {
        if (Object.getPrototypeOf(source) == Array.prototype) {
            let array = Object.create(this.conf.arrayType);
            if (component) component[name] = array;
            for (let ele of source) {
                if (this.isSource(ele)) ele = pkg.compile.call(this, ele);
                Array.prototype.push.call(array, ele);
            }
            return array;
        }

        let type = source[this.conf.typeProperty];
        let object = creat.call(this, type, name, component);
        if (isTypeName(name)) defineClass.call(this, object, name);
        if (type && typeof type == "object" && Object.getPrototypeOf(type) == Array.prototype) {
            for (let i = 1; i < type.length; i++) {
                this.implement(object, this.forName(type[i]));
            }
        }
        this.implement(object, source);
        return source.$public ? object.public : object;

        function creat(type, name, component) {
            if (type === undefined || type === "") {
                type = null;
            } else if (Object.getPrototypeOf(type) == Array.prototype) {
                type = this.forName(type[0]);
             } else {
                type = this.forName(type)
            }
            let object = Object.create(type);
            if (component) component[name] = object;
            return object;
        }

        function defineClass(object, name) {
            object[Symbol.toStringTag] = name;
            object[Symbol.for("type")] = Object.create(object[Symbol.for("type")] || null);
            object[Symbol.for("owner")] = this._owner;
        }
        function isTypeName(name) {
            let first = name.substring(0, 1);
            return first == first.toUpperCase() && first != first.toLowerCase() ? true : false;
        }
    },
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
        createNew(source) {
            if (arguments.length == 0) source = null;
    
            if (this.isSource(source)) {
                return pkg.compile.call(this, source);
            } else if (typeof source == "object") {
                return Object.create(source);
            } else if (source && typeof source == "string") {
                return Object.create(this.forName(source));
            }
    
            throw new TypeError(`Invalid argument "${source}" for object creation.`);
        },
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
                value = pkg.compile.call(this, value, name, component);
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