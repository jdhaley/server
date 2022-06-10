import serveFile from "./module/core/service/actions/serveFile.js";
export default {
	//For viewing .ts only
	"/noted": "../noted",
	"/core": "../core",
	"/lang": "../lang",
	"/dsp": "../dsp",

	//For all apps
	"/module": "module",
	"/journal": serveFile,

	//Src app
	"/src": "../lang/app/site",
	"/src/app": "../lang/app/site/src.html",

	//Testing
	"/test": "../lang/test/site",
	"/test/app": "../lang/test/site/test.html",

	//Dsp
	"/test2": "../dsp/resources",
	"/test2/app": "../dsp/resources/dsp.html",
}