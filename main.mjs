import express	from "express";
import fs		from "fs";
import http	from "http";
import bodyParser	from "body-parser";
import start	from "./module/noted/service/start.js";
start({
	express: express,
	bodyParser: bodyParser,
	fs: fs,
	http: http
});