export default {
    type$: "/control",
	View: {
		type$: "Node",
		var$model: undefined,
		draw() {
		},
		bind(model) {
			this.model = model;
		},
		contentModel(contentView) {
			return this.model;
		},
		view(data) {
			this.draw();
			this.bind(data);
		},
		extend$actions: {
			view(event) {
				for (let view of this.to) {
					view.view(this.contentModel(view));
				}
			}
		}
	}
}