export default {
    type$: "/display",
	type$view: "/base/view",
    type$Shape: "/shape/Shape",
	View: {
		type$: ["Display", "view/View"],
		type$textUtil: "/base/util/Text",
		getCaption() {
			return this.conf.caption || this.textUtil.captionize(this.conf.name || "");
		},
		display() {
			this.super(display);
			if (this.conf && this.conf.name) this.peer.classList.add(this.conf.name);
		},
		view(data) {
			this.display();
		}
	},
	Collection: {
		type$: ["View", "view/Collection"],
		view(data) {
			this.display();
			this.model = data;
			this.forEach(this.model, this.createContent);
		}
	},
	Structure: {
		type$: ["View", "view/Structure"],
		var$collapsed: "false", //3 states: ["true", "false", "" (non-collapseable)]
		display() {
			if (this.isDrawn) return;
			this.super(display);
			this.parts = Object.create(null);
			this.forEach(this.members, this.createContent);
			this.isDrawn = true;
		},
		view(data) {
			this.display();
			this.model = data;
		},
		append(control) {
			this.super(append, control);
			let key = control.peer.$key;
			if (isNaN(+key)) control.peer.classList.add(key);
			this.parts[key] = control;
		}
	},
	Record: {
		type$: ["Structure", "Observer"],
		type$typing: "/util/Typing",
		isDynamic: false,
		extend$conf: {
			memberKeyProperty: "name",
			type$members: "" //object or array
		},
		//TODO - work in logic with the extend$ facet (it can accept arrays containing element.name objects)
		//TOOD - re above - more generally - thinking about converting arrays based on key/id value.
		once$members() {
			let members = this.conf.members;
			let keyProp = this.conf.memberKeyProperty || "name";
			if (members && members[Symbol.iterator]) {
				members = Object.create(null);
				for (let member of this.conf.members) {
					let key = member[keyProp];
					if (key) members[key] = member;
				}
			} else {
				for (let key in members) {
					let member = members[key];
					if (!member[keyProp]) member[keyProp] = key;
				}
			}
			return members;
		},
		view(model) {
			this.super(view, model);
			if (this.isDynamic) this.bindDynamic();
		},
		bindDynamic() {
			let props = Object.create(null);
			for (let name in this.model) {
				if (!this.members[name]) {
					props[name] = this.typing.propertyOf(name, this.model[name]);
				}
			}
			this.properties = props;
			this.forEach(props, this.createContent);
		}
	},
	Section: {
		type$: "Structure",
		members: {
			type$header: "Display",
			type$body: "Display",
			type$footer: "Display"
		},
		size(x, y) {
			for (let part of this.to) {
				if (part != this.parts.body) y -= part.bounds.height;
			}
			this.style.minWidth = x + "px";
			this.parts.body.style.minHeight = y + "px";
			this.style.maxWidth = x + "px";
			this.parts.body.style.maxHeight = y + "px";
		},
		extend$actions: {
			collapse(event) {
				if (this.collapsed === "false") {
					this.parts.body.style.display = "none";
					this.collapsed = "true";
				}
			},
			expand(event) {
				if (this.collapsed === "true") {
					this.parts.body.style.removeProperty("display");
					this.collapsed = "false";
				}
			},
			click(event) {
				if (event.target == this.parts.header.peer) {
					this.receive(this.collapsed === "true" ? "expand" : "collapse");
				}
			}
		}
	},
	Property: {
		type$: "View",
		get$contentType() {
			return this.owner.editors[this.conf.inputType || this.conf.dataType] || this.owner.editors.string;
		},
		display() {
			this.super(display);
			let ele = this.owner.create(this.contentType, this.conf);
			this.append(ele);
		},
		view(model) {
			this.display();
			this.model = model && model[this.conf.name];
		},
		extend$actions: {
			activate(event) {
				let model = this.owner.origin.data[this.conf.dataset][this.model];
				let type = this.owner.origin.types[this.conf.objectType];
				let view = this.owner.create(this.conf.linkControl, type);
				this.owner.append(view);
				let b = this.bounds;
				view.bounds = {
					left: b.left,
					top: b.bottom
				};
				view.view(model);
				this.owner.send(view, "view");
			}
		}
	},
	Caption: {
		type$: ["View", "Shape"],
		display() {
			this.super(display);
			if (!this.rule) this.createRule();
			this.peer.innerText = this.getCaption();
			if (this.conf.dynamic) this.peer.classList.add("dynamic");
		},
		createRule() {
			let flex = +(this.conf.columnSize);
			let selector = "#" + getParentId(this.peer) + " ." + this.conf.name;
			this.rule = this.owner.createStyle(selector, {
				"flex": (this.conf.flex === false ? "0 0 " : "1 1 ") + flex + "cm",
				"min-width": flex / 2 + "cm"
			});
			console.log(this.rule);
			function getParentId(node) {
				for (; node; node = node.parentNode) {
					if (node.id) return node.id;
				}
			}
		}
	},
	Key: {
		type$: ["View", "Shape"],
		display() {
			this.super(display);
			let key = this.of.peer.$key || "";
			this.peer.textContent = key;
		}
	}
}