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
            type$ownerType: "/core/Component"
        },
        load(source) {
            let pkg = source.package;
            for (let name in source.use) {
                if (pkg[name]) console.error(`Package name "${name}" conflict with use "${name}"`);
                pkg[name] = source.use[name].package
            }

            let ctx = this.create(this);
            ctx._dir = source.package;
            ctx._owner = ctx.create(this.conf.ownerType);

            ctx.implement(ctx._owner, source);
            ctx.implement(ctx._owner, {
                forName: function(name) {
                    return ctx.forName(name);
                },
                create: function (from) {
                    return ctx.create(from);
                },
                extend: function(object, from) {
                    return ctx.extend(object, from);
                },
                define: function (object, name, value, facet) {
                    return ctx.define(object, name, value, facet);
                }
            });
            console.log(ctx._owner);
            return ctx._owner;
        },
    }
}
export default pkg;