import baseTypes from "./youni.works/ui/conf/types.js";
import viewTypes from "./views.js";

import article from "./youni.works/ui/controllers/article.js";
import frame from "./youni.works/ui/controllers/frame.js";

export default {
	controllers: {
		frame: frame,
		article: article
	},
	baseTypes: baseTypes,
	viewTypes: viewTypes,
	unknownType: "text",

	sources: "/journal",
	type: "properties"
}
