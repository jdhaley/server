import display from "./youni.works/ui/actions/display.js";
import baseTypes from "./youni.works/ui/conf/typeConf.js";

import viewTypes from "./views.js";

export default {
	actions: display,

	baseTypes: baseTypes,
	viewTypes: viewTypes,

	unknownType: "unknown",
	defaultType: "task",
	sources: "/journal",
	recordCommands: true
}
