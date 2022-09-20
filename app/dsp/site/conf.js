import article from "./youni.works/ui/controllers/article.js";

import baseTypes from "./youni.works/ui/conf/types.js";
import viewTypes from "./views.js";

export default {
	actions: article,

	baseTypes: baseTypes,
	viewTypes: viewTypes,
	unknownType: "unknown",

	sources: "/journal",
	type: "task"
}
