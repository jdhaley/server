import { extend } from "../../../../../youni.works/v2/base/util";
import { Editor } from "../../../../../youni.works/v2/ui/article";
import list from "../../../../../youni.works/v2/ui/controllers/list";
import { Display, getHeader } from "../../../../../youni.works/v2/ui/display";
import { UserEvent } from "../../../../../youni.works/v2/ui/ui";

export default extend(list, {
	dblclick(this: Editor, event: UserEvent) {
		event.subject = "";
		let view = event.on as Display;
		if (getHeader(event.on, event.target as Node)) {
			if(view.type$.propertyName=="tasks") {
				let content = view.v_content;
				content.hidden = content.hidden ? false : true;
			}
		}
	}
});