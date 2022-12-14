import { implement } from "./youni.works/base/util.js";
import article from "./youni.works/ui/actions/article.js";
import baseTypes from "./youni.works/ui/conf/baseTypes.js";
import boxTypes from "./youni.works/ui/conf/editorTypes.js";
import editorTypes from "./youni.works/ui/conf/editorTypes.js";

import dspTypes from "./types.js";

const articleTypes = implement(dspTypes, boxTypes, editorTypes);

export default {
	actions: article,

	baseTypes: baseTypes,
	articleTypes: articleTypes,

	sources: "/journal",
	recordCommands: true
}
