export default {
	type$: "/view",
	type$Shape: "/shape/Shape",
	Value: {
		type$: "View",
		bind: function bind(model) {
			this.super(bind, model);
			this.peer.textContent = model;
		}
	},
	Container: {
		type$: "View",
		get$elementType: function() {
			return this.conf.elementType;
		},
		forEach: function(object, method) {
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
		createElement: function(value, key, object) {
			let type = this.typeFor(value, key);
			let conf = this.configurationFor(value, key);
			let control = this.owner.create(type, conf);
			control.peer.$key = this.keyFor(value, key);
			this.append(control);
			return control;
		},
		keyFor: function(value, key) {
			return key;
		},
		typeFor: function(value, key) {
			return this.elementType;
		},
		configurationFor: function(value, key) {
			return this.conf;
		}
	},
	Composite: {
		type$: "Container",
		get$members: function() {
			return this.conf.members;
		},
		parts: {
		},
		start: function start(conf) {
			this.super(start, conf);
			this.let("parts", Object.create(null));
		},
		draw: function draw() {
			this.super(draw);
			this.forEach(this.members, this.createElement);
		},
		append: function append(control) {
			this.super(append, control);
			let key = control.peer.$key;
			if (isNaN(+key)) control.peer.classList.add(key);
			this.parts[key] = control;
		},
		typeFor: function(value, key) {
			if (value && typeof value == "object") {
				return value.receive ? value : value.elementType || this.elementType;
			}
			debugger;
			return this[Symbol.for("owner")].forName("" + value) || this.elementType;
		},
		configurationFor: function(value, key) {
			return value && typeof value == "object" && !value.receive ? value : this.conf;
		}
	},
	Collection: {
		type$: ["Container", "Observer"],
		bind: function bind(model) {
			this.observe(model);
			this.model = model;
			this.forEach(model, this.createElement);
		},
		unbind: function() {
			this.unobserve(this.model);
			this.model = undefined;
		},
		bindElement: function(view) {
			view.bind(this.model[view.peer.$key]);
		}
	},
	Record: {
		type$: ["Composite", "Observer"],
		bind: function(model) {
			this.observe(model);
			this.model = model;
		},
		unbind: function() {
			this.unobserve(this.model);
			this.model = undefined;
		}
	},
	Object: {
		type$: "Record",
		use: {
			type$Typing: "/base/util/Typing"
		},
		once$members: function() {
			let members = this.conf.members;
			if (members && typeof members.length == "number") {
				members = Object.create(null);
				for (let member of this.conf.members) {
					members[member.name] = member;
				}
			}
			return members;
		},
		bind: function bind(model) {
			this.super(bind, model);
			let props = Object.create(null);
			for (let name in model) {
				if (!this.members[name]) {
					props[name] = this.use.Typing.propertyOf(name, model[name]);
				}
			}
			this.properties = props;
			this.forEach(props, this.createElement);
		}
	},
	Pane: {
		type$: ["View", "Shape"],
		get$elementType: function() {
			return this.conf.elementType;
		},
		get$elementConf: function() {
			return this.conf;
		},
		draw: function draw() {
			this.super(draw);
			let type = this.elementType;
			let conf = this.elementConf;
			let control = this.owner.create(type, conf);
			this.append(control);
			return control;
		},
		extend$actions: {
			mousemove: function(event) {
				//Hit test in bottom right (BR) zone to track movement.
				if (this.getZone(event.clientX, event.clientY, this.conf.border) == "BR") {
					this.style.cursor = "nwse-resize";
				} else if (event.altKey || event.target == this.peer) {
					this.style.cursor = "move";
				} else {
					this.style.removeProperty("cursor");
				}
			},
			grab: function(event) {
				let b = this.bounds;
				this.peer.$tracking = {
					insideX: event.x - b.left,
					insideY: event.y - b.top
				}
                if (this.getZone(event.clientX, event.clientY, this.conf.border) == "BR") {
					event.track = this;
					this.peer.$tracking.subject = "size";
					this.style.cursor = "nwse-resize";
				} else if (event.altKey || event.target == this.peer) {
					event.track = this;
					this.peer.$tracking.subject = "position";
					this.owner.style.cursor = "move";
				}
			}
		}
	}
}