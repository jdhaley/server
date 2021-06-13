export default function main(module, conf) {
	let pkg = module.package;
	let factory = Object.create(pkg.factory.Factory);
	factory.use.Array = pkg.core.Array;
	factory.conf = conf;
//	factory.context = factory.create();
	factory.implement(factory, pkg.context.Context);
	factory.implement(factory, pkg.context.FactoryContext);
	factory._dir = pkg;
	pkg = factory.create(pkg);
	let loader = factory.extend(pkg.context.Loader);
	factory.define(loader, "conf", conf);
	module.load = function(module) {
		return loader.load(module);	
	}
	return module.load(module);
}