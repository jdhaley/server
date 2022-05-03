import express	from "express";
import fs		from "fs";
import http		from "http";
import bodyParser from "body-parser";

export default {
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
