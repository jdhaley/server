import display from "./youni.works/ui/controllers/display.js";
import editors from "./youni.works/ui/conf/editors.js";

import viewTypes from "./views.js";

export default {
	actions: display,

	baseTypes: editors,
	viewTypes: viewTypes,
	unknownType: "unknown",

	sources: "/journal",
	type: "task"
}
