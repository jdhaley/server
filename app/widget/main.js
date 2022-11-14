
import { ElementView } from "./youni.works/ui/widgets/display.js";

// let header = {
// 	kind: "caption",
// 	content: (props) => `The title is "${props.title}".`
// }

let test = {
	kind: "test",
	prop: {
		title: "Test thing"
	},
	header: {
		kind: "caption",
		content: "Test thing"
	},
	content: "test content",
	actions: {
	}
}

new ElementView(document.body, test);