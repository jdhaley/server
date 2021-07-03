export default {
    type$: "/display",
	type$view: "/base/view",
    type$Shape: "/shape/Shape",
	Structure: {
		type$: ["Display", "view/Structure"],
		var$collapsed: "false", //3 states: ["true", "false", "" (non-collapseable)]
		draw() {
			this.super(draw);
			this.parts = Object.create(null);
			this.forEach(this.members, this.createContent);
		},
		append(control) {
			this.super(append, control);
			let key = control.peer.$key;
			if (isNaN(+key)) control.peer.classList.add(key);
			this.parts[key] = control;
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
	Collection: {
		type$: ["Display", "view/Collection"]
	},
	Record: {
		type$: ["Structure", "Observer"],
		type$typing: "/util/Typing",
		isDynamic: false,
		observe(model) {
			this.super(observe, model);
			this.model = model;
			if (this.isDynamic) this.bindDynamic();
		},
		unbind() {
			this.unobserve(this.model);
			this.model = undefined;
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
	},
	Cell: {
		type$: "Display",
		type$textUtil: "/base/util/Text",
		getCaption() {
			return this.conf.caption || this.textUtil.captionize(this.conf.name || "");
		},
		draw() {
			this.super(draw);
			if (this.conf.name) this.peer.classList.add(this.conf.name);
		}
	},
	Property: {
		type$: "Cell",
		get$contentType() {
			return this.owner.editors[this.conf.inputType || this.conf.dataType] || this.owner.editors.string;
		},
		draw() {
			this.super(draw);
			let ele = this.owner.create(this.contentType, this.conf);
			this.append(ele);
		},
		observe(model) {
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
		type$: ["Cell", "Shape"],
		draw: function draw() {
			this.super(draw);
			if (!this.rule) this.createRule();
			this.peer.innerText = this.getCaption();
			if (this.conf.dynamic) this.peer.classList.add("dynamic");
		},
		bind: function(model) {
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
		type$: ["Cell", "Shape"],
		observe(model) {
			let key = this.of.peer.$key || "";
			this.peer.textContent = key;
		}
	}
}