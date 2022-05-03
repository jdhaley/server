import serveFile from "./module/noted/service/serveFile.js";
export default {
	//For viewing .ts only
	"/noted": "../noted",
	"/core": "../core",
	"/lang": "../lang",

	//For all apps
	"/module": "module",
	"/journal": serveFile,

	//Src app
	"/src": "site",
	"/src/app": "site/src.html",
}