	export default function main(module) {
		let sys = module.use.system.sys;
		module = sys.extend(sys.use.Module, module);
		module.compile(conf.package);
		return module;
	}