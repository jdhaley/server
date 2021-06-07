import express		from "express";
import fs			from "fs";
import https		from "https";

import filer		from "./filer.mjs";
import "./compile.mjs";

export default function main(conf) {
	const app = express();
	app.use(conf.siteEnv, express.static(conf.siteDir));
	let dyn = filer(conf);
	app.use(conf.fileAlias, dyn);
	
	const credentials = {
		key: fs.readFileSync(conf.key),
		cert: fs.readFileSync(conf.cert)
	};
	const httpsServer = https.createServer(credentials, app);

	httpsServer.listen(conf.port, () => console.log(`NEW HTTPS Server listening on port "${conf.port}"`));
	return httpsServer;
}

