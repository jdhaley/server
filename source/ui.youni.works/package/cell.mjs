export default {
    type$: "/display",
	type$container: "/base/container",
    type$Shape: "/shape/Shape",
	Structure: {
		type$: ["Display", "container/Structure"],
		// parts: {
		// },
		// start(conf) {
		// 	this.super(start, conf);
		// 	this.let("parts", Object.create(null));
		// },
		draw() {
			this.super(draw);
			this.forEach(this.members, this.createContent);
		},
		append(control) {
			this.super(append, control);
			let key = control.peer.$key;
			if (isNaN(+key)) control.peer.classList.add(key);
	//		this.parts[key] = control;
		}
	},
	Collection: {
		type$: ["Display", "container/Collection"]
	},
	Record: {
		type$: ["Structure", "Observer"],
		type$typing: "/util/Typing",
		isDynamic: false,
		//TODO - work in logic with the extend$ facet (it can accept arrays containing element.name objects)
		//TOOD - re above - more generally - thinking about converting arrays based on key/id value.
		once$members() {
			let members = this.conf.members;
			if (members && typeof members.length == "number") {
				members = Object.create(null);
				for (let member of this.conf.members) {
					members[member.name] = member;
				}
			}
			return members;
		},
		bind(model) {
			this.observe(model);
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
		}
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
		bind(model) {
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
		bind(model) {
			let key = this.of.peer.$key || "";
			this.peer.textContent = key;
		}
	}
}