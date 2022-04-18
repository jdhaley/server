import express	from "express";
import fs		from "fs";
import http	from "http";
import bodyParser	from "body-parser";

import start from "./module/core/service/service.js"
import serviceConf	from "./module/noted/service/conf.js";

const serverConf = {
	server: {
		port: 4040,
	},
	modules: {
		express: express,
		bodyParser: bodyParser,
		fs: fs,
		http: http
	}
}
start(serverConf, serviceConf);