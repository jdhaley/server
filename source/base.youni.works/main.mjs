	export default function main(module, conf) {
		let system = module.use.system;
		let sys = system.sys;
		let ctx = module.package;
		ctx.system = sys.instance();
		for (let pkg in system.package) {
			ctx.system[pkg] = system.package[pkg];
		}
		console.log(ctx);
		sys.$context = ctx;
		module = sys.create(module);
		console.log(module);
		return module;
	}