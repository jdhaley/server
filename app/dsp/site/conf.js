import display from "./youni.works/edit/actions/display.js";
import baseTypes from "./youni.works/ui/conf/types.js";

import viewTypes from "./views.js";

export default {
	actions: display,

	baseTypes: baseTypes,
	viewTypes: viewTypes,
	unknownType: "unknown",

	sources: "/journal",
	type: "task"
}
