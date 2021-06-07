export default function main(conf) {
	const pkg = conf.node_modules;
	
	const app = pkg.express();
	app.use("/prd", pkg.express.static(conf.site));

	let filer = conf.server_modules.filer(conf);
	let module = {
		id: "base.youni.works",
		version: "1.2.0"
	};
	conf.server_modules.compile("fs/source/", module);
	console.log(module);
	app.use("/file", filer);
//	app.use("/module", compile);

//	app.use("/packages.json", pkgdep);
//	function pkgdep(req, res) {
//		res.type("json");
//		res.send('[{"name": "a"},{"name": "b"}]');		
//	}
	
	const credentials = {
		key: pkg.fs.readFileSync(conf.key),
		cert: pkg.fs.readFileSync(conf.cert)
	};
	const httpsServer = pkg.https.createServer(credentials, app);

	httpsServer.listen(conf.port, () => console.log(`NEW HTTPS Server listening on port "${conf.port}"`));
	return httpsServer;
}

