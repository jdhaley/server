export default {
    type$: "/control",
	View: {
		type$: "Node",
		var$model: undefined,
		draw() {
		},
		unbind() {
			this.model = undefined;
		},
		bind(model) {
			this.model = model;
		},
		bindContent(contentView) {
			contentView.bind(this.model);
		},
		view(data) {
			this.unbind();
			this.draw();
			this.bind(data);
			this.owner.send(this, "view");
		},
		extend$actions: {
			view(event) {
				for (let view of this.to) {
					view.unbind();
					view.draw();
					this.bindContent(view);
				}
			}
		}
	},
	Container: {
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
	}
}