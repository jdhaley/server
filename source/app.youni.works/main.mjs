export default function main(module, conf) {
	conf.window = window;
	let sys = module.use.ui.use.system.sys;
	module = sys.load(module);
	let app = sys.extend(module.package.app.App);
	app.start(conf);
	return module;
}