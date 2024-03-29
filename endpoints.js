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
	"/dsp/test": "app/dsp/site/test.html",
	"/dsp/youni.works": "module/youni.works/v2",
	//Property editor
	"/pe": "app/pe",
	"/pe/app": "app/pe/app.html",
	"/pe/youni.works": "module/youni.works/v2",

	//Noted
	"/noted": "app/noted",
	"/noted/app": "app/noted/note.html",
	"/noted/module": "module/noted/v2",

	//Widget
	"/widget": "app/widget",
	"/widget/widgets": "module/widgets",
	"/widgets": "../widgets",

	//Simple
	"/simple": "app/simple",
	"/simple/fw": "module/simpleedit",
	"/simpleedit": "../simpleedit",

	//x
	"/x": "app/x",
	"/x/youni.works": "module/youni.works/v2",
}