export default {
    type$: "/control",
	View: {
		//A View requires a Node prototype.
		//requires$: "Node",
		var$model: undefined,
		view(data) {
			this.draw();
			if (this.model && this.model != data) this.unobserve(this.model);
			this.model = data;
			this.observe(data);
		},
		draw() {
		},
		observe(object) {
		},
		unobserve(object) {
		},
		modelFor(contentView) {
			return this.model;
		},
		extend$actions: {
			view(event) {
				for (let view of this.to) {
					view.view(this.modelFor(view));
				}
			}
		}
	},
	Container: {
		conf: {
			type$contentType: "View"
		},
		//TODO general issue with interfaces.  Implementing container will override the model logic
		//if the Container extends from View.
		//type$: "View",
		/**
		 * The common content type.
		 */
		get$contentType() {
			return this.conf.contentType;
		},
		createContent(value, key, object) {
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
			return this.contentType;
		},
		configurationFor(value, key) {
			return this.conf;
		}
	},
    Structure: {
		type$: "Container",
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
		var$parts: {
		},
		// key(key) {
		// },
		// get(key) {

		// },
		draw() {
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
			return this[Symbol.for("owner")].forName("" + value) || this.contentType;
		},
		configurationFor(value, key) {
			return value && typeof value == "object" && !value.receive ? value : this.conf;
		}
	},
	Collection: {
		type$: ["Container", "Observer"],
		observe(model) {
			if (this.model && this.model != model) {
				this.unobserve(this.model);
			}
			this.model = model;
			this.super(observe, model);
			this.forEach(model, this.createContent);
		},
		modelFor(contentView) {
			return this.model[contentView.peer.$key];
		}
	}
}