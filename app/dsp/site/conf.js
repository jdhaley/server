import display from "./youni.works/ui/actions/display.js";
import baseTypes from "./youni.works/ui/conf/types.js";
import contentTypes from "./youni.works/ui/conf/contentTypes.js";

import viewTypes from "./views.js";

export default {
	actions: display,

	baseTypes: baseTypes,
	contentTypes: contentTypes,
	viewTypes: viewTypes,

	unknownType: "unknown",
	defaultType: "task",
	sources: "/journal"
}
