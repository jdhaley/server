export default {
	type$: "/view",
	Value: {
		type$: "View",
		bind(model) {
			this.super(bind, model);
			this.peer.textContent = model;
		}
	},
	Container: {
		type$: "View",
		get$elementType() {
			return this.conf.elementType;
		},
		forEach(object, method) {
			if (object && typeof object.length == "number") {
				for (let i = 0, length = object.length; i < length; i++) {
					method.call(this, object[i], i, object);
				}
			} else {
				for (let name in object) {
					method.call(this, object[name], name, object);
				}
			}
		},
		createElement(value, key, object) {
			let type = this.typeFor(value, key);
			let conf = this.configurationFor(value, key);
			let control = this.owner.create(type, conf);
			control.peer.$key = this.keyFor(value, key);
			this.append(control);
			return control;
		},
		keyFor(value, key) {
			return key;
		},
		typeFor(value, key) {
			return this.elementType;
		},
		configurationFor(value, key) {
			return this.conf;
		}
	},
	Composite: {
		type$: "Container",
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
			this.forEach(this.members, this.createElement);
		},
		append(control) {
			this.super(append, control);
			let key = control.peer.$key;
			if (isNaN(+key)) control.peer.classList.add(key);
			this.parts[key] = control;
		},
		typeFor(value, key) {
			if (value && typeof value == "object") {
				return value.receive ? value : value.elementType || this.elementType;
			}
			debugger;
			return this[Symbol.for("owner")].forName("" + value) || this.elementType;
		},
		configurationFor(value, key) {
			return value && typeof value == "object" && !value.receive ? value : this.conf;
		}
	},
	Collection: {
		type$: ["Container", "Observer"],
		bind(model) {
			this.observe(model);
			this.model = model;
			this.forEach(model, this.createElement);
		},
		unbind() {
			this.unobserve(this.model);
			this.model = undefined;
		},
		bindElement(view) {
			view.bind(this.model[view.peer.$key]);
		}
	},
	Record: {
		type$: ["Composite", "Observer"],
		bind(model) {
			this.observe(model);
			this.model = model;
		},
		unbind() {
			this.unobserve(this.model);
			this.model = undefined;
		}
	},
	Object: {
		type$: "Record",
		type$typing: "/base/util/Typing",
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
			this.super(bind, model);
			let props = Object.create(null);
			for (let name in model) {
				if (!this.members[name]) {
					props[name] = this.typing.propertyOf(name, model[name]);
				}
			}
			this.properties = props;
			this.forEach(props, this.createElement);
		}
	}
}