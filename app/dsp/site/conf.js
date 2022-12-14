import article from "./youni.works/ui/actions/article.js";
import baseTypes from "./youni.works/ui/conf/typeConf.js";

import viewTypes from "./views.js";

export default {
	actions: article,

	baseTypes: baseTypes,
	articleTypes: viewTypes,

	// unknownType: "unknown",
	// defaultType: "task",
	sources: "/journal",
	recordCommands: true
}
