import express	from "express";
import fs		from "fs";
import http	from "http";
import bodyParser	from "body-parser";
import start	from "./module/service/start.js";
start({
	express: express,
	bodyParser: bodyParser,
	fs: fs,
	http: http
});