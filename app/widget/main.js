
import { Frame } from "./youni.works/control/frame.js";
import { ElementView } from "./youni.works/ui/widgets/display.js";

import controller from "./youni.works/ui/actions/frame.js";
import shape from "./youni.works/ui/actions/shape.js";

new Frame(window, controller);

let test = {
	kind: "test",
	prop: {
		title: "Test thing"
	},
	header: {
		kind: "caption",
		content: "Test thing",
	},
	content: "test content",
	actions: shape
}

new ElementView(document.body, test);

let person = {
	kind: "person",
	prop: {
		title: "Person"
	},
	header: {
		kind: "caption",
		content: "Person"
	},
	content: {
		firstName: {
			header: {
				kind: "label",
				content: () => "<b>F</b>irst <b>N</b>ame"
			},
			content: "Billy"
		},
		lastName: {
			header: {
				kind: "label",
				content: "Last Name"
			},
			content: "Willy"
		},
		dob: {
			header: {
				kind: "label",
				content: "Date of Birth"
			},
			content: new Date().toISOString()
		}
	},
	footer: {
		content: "A person is a person no matter who small."
	},
	actions: {
	}
}

new ElementView(document.body, person);
