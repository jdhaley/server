export default {
	string() {
		this.let("nodeName", "div");
		this.peer.type = "string";
		this.peer.contentEditable = this.conf.readOnly ? false : true;
	},
	number() {
		this.let("nodeName", "input");
		this.peer.type = "number";
		if (this.conf.readOnly) this.peer.setAttribute("disabled", true);
	},
	date() {
		this.let("nodeName", "input");
		this.peer.type = "date";
		if (this.conf.readOnly) this.peer.setAttribute("disabled", true);
	},
	dateTime() {
		this.let("nodeName", "input");
		this.peer.type = "datetime";
		if (this.conf.readOnly) this.peer.setAttribute("disabled", true);
	},
	color() {
		this.let("nodeName", "input");
		this.peer.type = "color";
		if (this.conf.readOnly) this.peer.setAttribute("disabled", true);
	},
	boolean() {
		this.let("nodeName", "input");
		this.peer.type = "checkbox";
		if (this.conf.readOnly) this.peer.setAttribute("disabled", true);
	},
	object: link,
	array: link,
	link: link
}

function link() {
	this.let("nodeName", "a");
	let editor = this.peer;
	editor.classList.add("widget");
	editor.classList.add("link");
	editor.setAttribute("href", "");
	editor.textContent = "...";
}
//	text: {
//		type$: "use.prop.Text"
//	},
//	action: {
//		type$: "use.prop.Text"
//	},
//	media: {
//		type$: "use.prop.Media"
//	},
//	link: link,
//	list: {
//		type$: "use.prop.Link",
//		listType: "list | table | set"
//	}


function scalar() {
	let control = this;
	let editor;
	if (control.conf.protected) {
		editor = control.owner.createNode("input");
		editor.type = "password";
	} else if (control.conf.input) {
		editor = control.owner.createNode("input");
		editor.type = inputType(control);
	} else {
		editor = control.owner.createNode("div");
		editor.classList.add("input");
		editor.type = this.conf.dataType;
		editor.contentEditable = true;
	}
	editor.classList.add("widget");
	return editor;
}

function inputType(control) {
	let type = control.conf.dataType || typeof control.model;
	switch (type) {
		case "number":
			return "number";
		case "date":
			return "date";
		case "boolean":
			return "checkbox";
		default:
			return "text";
	}
}
//"color"
const types = ["", "other", "string", "number", "boolean", "date", "array", ];
function typeOf(value) {
	//'empty' values
	if (value === undefined || value === null || isNaN(value)) return "";
	
	let type = typeof value;
	switch (type) {
		case "string":
			//parse date string
			//parse color
			//parse url?
			return type;
		case "number":
		case "boolean":
			return type;
		case "bigint":
			return "number";
		case "symbol":
		case "function":
			return "other";
	}
	
	if (value instanceof Date) return "date";
	if (value[Symbol.iterable]) return typeof value.length == "number" ? "array" : "sequence";
	let proto = Object.getPrototypeOf(value);
	if (proto === null || proto === Object.prototype) return "object";
}
