import rfs from "./module/youni.works/v2/service/actions/rfs.js";
export default {
	//For viewing .ts only
	// "/noted": "../noted",
	// "/core": "../core",
	// "/lang": "../lang",
	"/youni.works": "../youni.works",

	//For all apps
	"/module": "module",
	"/journal": rfs,

	// //Src app
	// "/src": "../lang/app/site",
	// "/src/app": "../lang/app/site/src.html",

	// //Testing
	// "/test": "../lang/test/site",
	// "/test/app": "../lang/test/site/test.html",

	//Dsp
	"/dsp": "app/dsp/site",
	"/dsp/app": "app/dsp/site/app.html",
	"/dsp/youni.works": "module/youni.works/v2"
}