const pkg = {
	type$: "/view",
	Editor: {
		type$: "View",
		dataType: "",
		get$inputType() {
			return this.dataType;
		},
		bind(value) {
			this.peer.textContent = value;
		},
		draw() {
			this.super(draw);
			this.peer.type = this.inputType;
			this.peer.contentEditable = this.conf.readOnly ? false : true;
		}
	},
	Input: {
		type$: "Editor",
		nodeName: "input",
		bind(value) {
			this.peer.value = value;
		},
		draw() {
			this.super(draw);
			delete this.peer.contentEditable;
			this.peer.type = this.inputType;
			if (this.conf.readOnly) this.peer.setAttribute("disabled", true);
		}
	},
	String: {
		type$: "Editor",
		dataType: "string",
	},
	Number: {
		type$: "Input",
		dataType: "number"
	},
	Date: {
		type$: "Input",
		dataType: "date"
	},
	Boolean: {
		type$: "Input",
		dataType: "checkbox"
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
	//more work needed...
	Object: {
		type$: "Editor",
		dataType: "object",
		bind(value) {
			this.textContent = "...";
		}
	},
	Collection: {
		type$: "Editor",
		dataType: "object",
		bind(value) {
			this.textContent = "...";
		}
	},
	Link: {
		type$: "Editor",
		extend$conf: {
			readOnly: true,
			linkControl: {
				type$: "/shape/Pane",
				elementType: "/grid/Sheet"
			}
		},
		draw() {
			this.super(draw);
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
				let model = this.owner.origin.data[this.conf.dataset][this.peer.textContent];
				let type = this.owner.origin.types[this.conf.objectType];
				let view = this.owner.create(this.conf.linkControl, type);
				this.owner.append(view);
				let b = this.bounds;
				view.bounds = {
					left: b.left,
					top: b.bottom
				};
				view.view(model);
			}
		}
	}
}
export default pkg;