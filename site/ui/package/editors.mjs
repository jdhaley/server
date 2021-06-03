const pkg = {
	$public: {
		type$: "/ui.youni.works/view",
		Editor: {
			type$: "View",
			dataType: "",
			get$inputType: function() {
				return this.dataType;
			},
			bind: function(value) {
				this.peer.textContent = value;
			},
			draw: function draw() {
				this.super(draw);
				this.peer.type = this.inputType;
				this.peer.contentEditable = this.conf.readOnly ? false : true;
			}
		},
		Input: {
			type$: "Editor",
			nodeName: "input",
			bind: function(value) {
				this.peer.value = value;
			},
			draw: function draw() {
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
			dataType: "object"
		},
		Collection: {
			type$: "Editor",
			dataType: "object"
		},
		Link: {
			type$: "Editor",
			bind: function(value) {
				this.textContent = "...";
			}
		}
	}
}
export default pkg;