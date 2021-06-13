export default function main(module, conf) {
	conf.symbols = conf.symbols();
	let pkg = module.package;
	let factory = Object.create(pkg.factory.Factory);
	factory.use.Array = pkg.core.Array;
	factory.conf = conf;
	factory.context = factory.create();
	factory.implement(factory, pkg.context.Context);
	factory.implement(factory, pkg.context.FactoryContext);
	factory.$context = pkg;
	module.package = factory.create(pkg);
	factory = factory.extend(module.package.context.Loader, {
		conf: conf,
	});
	module = factory.load(module);
	module.sys = factory;
	return module;
}