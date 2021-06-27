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
	}
}