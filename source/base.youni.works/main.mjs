	export default function main(module, conf) {
		let sys = module.use.system.sys;
		for (let name in module.use) {
			module.package[name] = module.use[name].package;
		}
		sys.$context = module.package;
		module = sys.create(module);
		console.log(module);
		return module;
	}