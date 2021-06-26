const pkg = {
	type$: "/view",
	Editor: {
		type$: "View",
		dataType: "",
	},
	Input: {
		type$: "Editor",
		nodeName: "input",
		get$inputType() {
			return this.dataType;
		},
		draw() {
			this.super(draw);
			this.peer.type = this.inputType;
			if (this.conf.readOnly) this.peer.setAttribute("disabled", true);
		},
		bind(value) {
			this.peer.value = value;
		}
	},
	Number: {
		type$: "Input",
		dataType: "number"
	},
	Boolean: {
		type$: "Input",
		dataType: "checkbox"
	},
	Date: {
		type$: "Input",
		dataType: "date"
	},
	Datetime: {
		type$: "Date",
		inputType: "datetime"
	},
	Color: {
		type$: "Input",
		dataType: "string",
		inputType: "color"
	},
	Password: {
		type$: "Input",
		dataType: "string",
		inputType: "password"
	},
	String: {
		type$: "Editor",
		dataType: "string",
		bind(value) {
			this.peer.textContent = value;
		},
		draw() {
			this.super(draw);
			this.peer.contentEditable = this.conf.readOnly ? false : true;
		}
	},
	//more work needed...
	Collection: {
		type$: "Editor",
		dataType: "object",
		bind(value) {
			this.textContent = "...";
		}
	},
	Object: {
		type$: "Editor",
		dataType: "object",
		bind(value) {
			this.textContent = "...";
		}
	},
	LinkNav: {
		type$: "View",
		nodeName: "img",
		draw() {
			this.peer.src = "/target/link.svg";
			this.peer.tabIndex = 1;
		},
		extend$actions: {
			click(event) {
				this.receive("navigate");
			},
			keydown(event) {
				if (event.key == "Enter" || event.key == " ") this.receive("navigate");
			},
			navigate(event) {
				if (!this.pane) {
					let type = this.owner.origin.types[this.conf.objectType];
					let model = this.owner.origin.data[this.conf.dataset][this.of.model];

					this.pane = this.owner.create(this.conf.linkControl, type);	
					this.pane.view(model);
				}
				if (!this.pane.peer.parentNode) {
					this.owner.append(this.pane);
				}
				let b = this.bounds;
				this.pane.bounds = {
					left: b.left,
					top: b.bottom
				};
			}
		}
	},
	Link: {
		type$: "Editor",
		extend$conf: {
			type$linkNavControl: "LinkNav",
			linkControl: {
				type$: "/shape/Pane",
				elementType: "/grid/PropertySheet"
			},
			type$editorControl: "String"
		},
		draw() {
			this.super(draw);
			this.value = this.owner.create(this.conf.editorControl, this.conf);
			this.peer.tabIndex = 1;
			this.append(this.value);
			this.icon = this.owner.create(this.conf.linkNavControl, this.conf);
			this.append(this.icon);
		}
	}
}
export default pkg;