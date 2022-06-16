import express	from "express";
import fs		from "fs";
import http		from "http";
import bodyParser from "body-parser";
import endpoints from "./endpoints.js";

export default {
	modules: {
		express: express,
		bodyParser: bodyParser,
		fs: fs,
		http: http
	},
	engine: express,
	server: {
		port: 4040,
	},
	service: {
	},
	endpoints: endpoints
}