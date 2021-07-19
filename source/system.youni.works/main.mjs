export default function main(module, conf) {
	let pkg = module.package;
	let factory = Object.create(pkg.factory.Factory);
	factory.conf = conf;
	factory.implement(factory, pkg.context.Resolver);
	factory.implement(factory, pkg.context.FactoryContext);
	factory._dir = pkg;
	pkg = factory.compile(pkg);
	
	let loader = factory.creat(pkg.context.Loader);
	factory.define(loader, "conf", conf);
	module.load = function(module) {
		return loader.load(module);	
	}
	return module.load(module);
}