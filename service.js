import serveFile from "./module/core/service/actions/serveFile.js";
export default {
	//For viewing .ts only
	"/noted": "../noted",
	"/core": "../core",
	"/lang": "../lang",

	//For all apps
	"/module": "module",
	"/journal": serveFile,

	//Src app
	"/src": "../lang/app/site",
	"/src/app": "../lang/app/site/src.html",
}