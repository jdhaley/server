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
		type$: ["View", "Sizeable"],
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
			this.peer.innerText = this.getCaption();
			//if (this.conf.dynamic) this.peer.classList.add("dynamic");
		},
		bind: function(model) {
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
	},
	//Lift the dynamic capability from here...
	OLD_Properties: {
		type$typing: "/base.youni.works/util/Typing",
		dynamicProperties: function(object) {
			let superType = Object.create(null);
			for (let prop of this.conf.properties) {
				superType[prop.name] = prop;
			}
			let properties = [];
			for (let name in object) {
				if (!superType[name]) {
					let prop = this.typing.propertyOf(name, object[name]);
					properties.push(prop);
				}
			}
			return properties;
		},
		displayProperties: function(properties) {
			if (!properties) return;
			for (let propConf of properties) {
				let propType = propConf.controlType || "/ui.youni.works/object/Part";
				let prop = this.owner.create(propType, propConf);
				this.sys.define(prop, "object", this);
				this.append(prop);
			}
		},
		bind: function(model) {
			this.unobserve(this.model);
			this.observe(model);
			this.model = model;
			this.displayProperties(this.dynamicProperties(model));
		},
	},
	Sizeable: {
		type$: "",
		shapeConf: {
			border: 6,
			minWidth: 48,
			minHeight: 24	
		},
		moveTo: function(x, y) {
			if (x < 0) x = 0;
			if (y < 0) y = 0;
			this.style.left = x + "px";
			this.style.top = y + "px";
		},
		sizeTo: function(width, height) {
			if (width < this.shapeConf.minWidth) width = this.shapeConf.minWidth;
			if (height < this.shapeConf.minHeight) height = this.shapeConf.minHeight;
			this.style.width = width + "px";
			this.style.height = height + "px";
		},
		extend$actions: {
			size: function(event) {
				this.sizeTo(event.width, event.height);
			},
			mousedown: function(event) {
				//Hit test in bottom right (BR) zone to track movement.
				if (this.getZone(event.clientX, event.clientY, this.shapeConf.border) == "BR") {
					event.track = this; //Track window mouse events.
				}
			},
			mousemove: function(event) {
				//Hit test in bottom right (BR) zone to track movement.
				if (this.getZone(event.clientX, event.clientY, this.shapeConf.border) == "BR") {
					this.style.cursor = "nwse-resize";
				} else {
					this.style.cursor = "default";
				}
			},
			track: function(event) {
				this.owner.style.cursor = "nwse-resize";
				let rect = this.peer.getBoundingClientRect();
				event.width = event.clientX - rect.x;
				event.height = event.clientY - rect.y;
				event.subject = "size";
				this.receive(event);
			},
			trackEnd: function(event) {
				event.subject = "";
				this.owner.style.cursor = "default";
			}
		},
		getZone: function(x, y, border) {
			let rect = this.peer.getBoundingClientRect();
			x -= rect.x;
			y -= rect.y;
			let zone;

			if (y < border) {
				zone = "T";
			} else if (y > rect.height - border) {
				zone = "B";
			} else {
				zone = "C";
			}
			if (x < border) {
				zone += "L";
			} else if (x > rect.width - border) {
				zone += "R";
			} else {
				zone += "C";
			}
			return zone;
		}	
	}
}