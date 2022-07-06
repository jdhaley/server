import shortcuts from "./youni.works/ui/conf/shortcuts.js";
import controllers from "./youni.works/ui/conf/controllers.js";
import baseTypes from "./youni.works/ui/conf/types.js";
import viewTypes from "./views.js";

export default {
	sources: "/journal",
	baseTypes: baseTypes,
	viewTypes: viewTypes,
	unknownType: "text",
	type: "properties",

	shortcuts: shortcuts,
	controllers: controllers,
}
