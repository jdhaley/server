export default {
    type$: "/control",
	View: {
		//A View requires a Node prototype.
		//requires$: "Node",
		var$model: undefined,
		view(data) {
			this.model = data;
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
		type$: "View",
		extend$conf: {
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
		members: {
		},
		var$parts: {
		},
		view(model) {
			this.super(view, model);
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
		view(model) {
			this.super(view, model);
			this.forEach(model, this.createContent);
		},
		modelFor(contentView) {
			return this.model[contentView.peer.$key];
		}
	}
}