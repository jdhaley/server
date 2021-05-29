export default {
	type$: "/ui.youni.works/container",
	Grid: {
		type$: "Composite",
		members: {
			header: {
				type$: "Composite",
				members: {
					type$header: "Handle",
					body: {
						type$: "Composite",
						type$elementType: "Caption"
					}
				}
			},
			body: {
				type$: "Collection",
				elementType: {
					type$: "Composite",
					className: "object",
					members: {
						header: {
							type$: "Handle"
						},
						body: {
							type$: "Composite",
							type$elementType: "Cell"
						}
					}
				}
			},
			type$footer: "View"
		}
	},
	Handle: {
		type$: "View",
		bind: function(model) {
			console.log(this.of.peer.$key, model);
		}
	},
	Property: {
		type$: "View",
		draw: function draw() {
			this.super(draw);
			this.let("className", this.conf.name);
			let s = +(this.conf.size ) || 1;
//			this.style.flex = `${s} 1`;
			this.style.minWidth = `${s * 3}mm`;
//			this.style.maxWidth = `${s}mm`;
		}
	},
	Cell: {
		type$: "Property",
		bind: function(model) {
			model = model && model[this.conf.name];
			if (typeof model == "object") model = "...";
			this.peer.textContent = model || "";
		},
		start: function(conf) {
			this.let("conf", conf);
			this.peer.contentEditable = true;
		}
	},
	Caption: {
		type$: "Property",
		use: {
			type$Naming: "/base.youni.works/util/Naming"
		},
		getCaption: function() {
			return this.conf.caption || this.use.Naming.captionize(this.conf.name);
		},
		draw: function draw() {
			this.super(draw);
			this.peer.innerText = this.getCaption();
		},
		bind: function(model) {
		},
		start: function(conf) {
			this.let("conf", conf);
		}
	}
}