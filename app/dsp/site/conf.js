import { implement } from "./youni.works/base/util.js";
import article from "./youni.works/ui/actions/article.js";
import baseTypes from "./youni.works/ui/conf/baseTypes.js";
import boxTypes from "./youni.works/ui/conf/editorTypes.js";
import editorTypes from "./youni.works/ui/conf/editorTypes.js";

import dspTypes from "./types.js";

export default {
	actions: article,

	types: implement(null, dspTypes, boxTypes, editorTypes, baseTypes),

	sources: "/journal",
	recordCommands: true
}
