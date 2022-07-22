import article from "./youni.works/ui/controllers/article.js";
import frame from "./youni.works/ui/controllers/frame.js";

import viewers from "./youni.works/ui/conf/viewers.js";
import modellers from "./youni.works/ui/conf/modellers.js";
import editors from "./youni.works/ui/conf/editors.js";

import baseTypes from "./youni.works/ui/conf/types.js";
import viewTypes from "./views.js";

export default {
	viewers: viewers,
	modellers: modellers,
	editors: editors,
	actions: {
		frame: frame,
		article: article
	},
	baseTypes: baseTypes,
	viewTypes: viewTypes,
	unknownType: "unknown",

	sources: "/journal",
	type: "task"
}
