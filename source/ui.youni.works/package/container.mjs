export default {
	type$: "/view",
	Structure: {
		type$: ["Display", "Container"],
		parts: {
		},
		get$members() {
			return this.conf.members;
		},
		start(conf) {
			this.super(start, conf);
			this.let("parts", Object.create(null));
		},
		draw() {
			this.super(draw);
			this.forEach(this.members, this.createContent);
		},
		append(control) {
			this.super(append, control);
			let key = control.peer.$key;
			if (isNaN(+key)) control.peer.classList.add(key);
			this.parts[key] = control;
		},
		typeFor(value, key) {
			if (value && typeof value == "object") {
				return value.receive ? value : value.contentType || this.contentType;
			}
			debugger;
			return this[Symbol.for("owner")].forName("" + value) || this.contentType;
		},
		configurationFor(value, key) {
			return value && typeof value == "object" && !value.receive ? value : this.conf;
		}
	},
	Collection: {
		type$: ["Display", "Container", "Observer"],
		bind(model) {
			this.observe(model);
			this.model = model;
			this.forEach(model, this.createContent);
		},
		unbind() {
			this.unobserve(this.model);
			this.model = undefined;
		},
		bindContent(view) {
			view.bind(this.model[view.peer.$key]);
		}
	},
	Record: {
		type$: ["Structure", "Observer"],
		type$typing: "/base/util/Typing",
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
		direction: "vertical",
		members: {
			type$header: "Display",
			type$body: "Display",
			type$footer: "Display"
		}
	}
}