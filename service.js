import serveFile from "./module/core/service/actions/serveFile.js";
export default {
	//For viewing .ts only
	"/noted": "../noted",
	"/core": "../core",
	"/lang": "../lang",
	"/v2.youni.works": "../youni.works/v2.youni.works",


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
	"/dsp": "../dsp/resources",
	"/dsp/app": "../dsp/resources/dsp.html",
	"/dsp/youni.works": "../youni.works/modules/v2.youni.works",
}