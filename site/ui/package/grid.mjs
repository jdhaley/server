export default {
	type$: "/ui.youni.works/container",
	Sheet: {
		type$: "Object",
		elementType: {
			type$: "Composite",
			className: "part",
			members: {
				type$header: "Caption",
				type$body: "Cell"
			}
		}
	},
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
		type$: ["View", "Shape"],
		use: {
			type$Naming: "/base.youni.works/util/Naming"
		},
		getCaption: function() {
			return this.conf.caption || this.use.Naming.captionize(this.conf.name);
		},
		draw: function draw() {
			this.super(draw);
			this.peer.classList.add(this.conf.name);
//			let s = +(this.conf.columnSize) || 1;
//			this.style.flex = `${s} 1`;
//			this.style.minWidth = `${s * 3}mm`;
//			this.style.maxWidth = `${s}mm`;
		}
	},
	Cell: {
		type$: "Property",
		bind: function(model) {
			model = model && model[this.conf.name];
			if (typeof model == "object") model = "...";
			model = model || "";
			if (this.peer.nodeName == "INPUT") {
				this.peer.value = model;
			} else {
				this.peer.textContent = model;
			}
		},
		start: function start(conf) {
			this.super(start, conf);
			let editor = this.owner.editors[conf.inputType || conf.dataType || "string"];
			editor && editor.call(this);
		}
	},
	Caption: {
		type$: "Property",
		draw: function draw() {
			this.super(draw);
			this.peer.draggable = true;
			this.peer.innerText = this.getCaption();
			if (this.conf.dynamic) this.peer.classList.add("dynamic");
		},
		bind: function(model) {
		}
	}
}

//		extend$actions: {
// 			mousedown: function(event) {
// 				event.preventDefault();
// 				this.$peer
// //				if (!this.pane) this = this.own
// 				let pane = this.$peer.owner.create("/ui.youni.works/grid/ViewPane");
// 				pane.from = this.$peer;
// 				pane.bounds = {
// 					top: pane.from.bounds.bottom,
// 					left: pane.from.bounds.left,
// 					width: 80,
// 					height: 200
// 				}
// 				pane.owner.append(pane);
// 				pane.peer.textContent = "Pop";
// 			}
//		}
