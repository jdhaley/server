export default {
	type$: "/ui.youni.works/container",
	Grid: {
		type$: "Composite",
		members: {
			header: {
				type$: "Composite",
				members: {
					header: {
						type$: "View",
						className: "handle"
					},
					body: {
						type$: "Composite", //or Record?
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
						type$header: "Handle",
						body: {
							type$: "Record",
							type$elementType: "Cell"
						}
					}
				}
			},
			footer: {
				type$: "Composite",
				members: {
					header: {
						type$: "View",
						className: "handle"
					},
					body: {
						type$: "Composite",
						elementType: {
							type$: "View",
							className: "caption"
						}
					}
				}
			}
		}
	},
	Handle: {
		type$: "View",
		bind: function(model) {
			let key = this.of.peer.$key;
			this.peer.textContent = key;
		}
	},
	Property: {
		type$: "View",
		getCaption: function() {
			return this.conf.caption || this.use.Naming.captionize(this.conf.name);
		},
		draw: function draw() {
			this.super(draw);
			this.peer.classList.add(this.conf.name);
			let s = +(this.conf.columnSize) || 1;
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
		draw: function draw() {
			this.super(draw);
			this.peer.innerText = this.getCaption();
		},
		bind: function(model) {
		},
		start: function(conf) {
			this.let("conf", conf);
		}
	},
	Sheet: {
		type$: "Record",
		elementType: {
			type$: "Composite",
			className: "part",
			members: {
				type$header: "Caption",
				type$body: "Cell"
			}
		}
	}
}