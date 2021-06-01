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
	boolean() {
		this.let("nodeName", "input");
		this.peer.type = "checkbox";
		if (this.conf.readOnly) this.peer.setAttribute("disabled", true);
	},
	//the following should not be specified as a datatype, only as an inputType.
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
	password() {
		this.let("nodeName", "input");
		this.peer.type = "password";
		if (this.conf.readOnly) this.peer.setAttribute("disabled", true);
	},
	//more work needed...
	object: link,
	array: link,
	link: link
}

function link() {
	let editor = this.peer;
	editor.classList.add("widget");
	editor.classList.add("link");
	editor.setAttribute("href", "");
	editor.textContent = "...";
	editor.onmousedown = function(event) {
		event.preventDefault();
		this.$peer
		let pane = this.$peer.owner.create("/ui.youni.works/grid/ViewPane");
		pane.from = this.$peer;
		pane.bounds = {
			top: pane.from.bounds.bottom,
			left: pane.from.bounds.left,
			width: 80,
			height: 200
		}
		pane.owner.append(pane);
		pane.peer.textContent = "Pop";
	}
}