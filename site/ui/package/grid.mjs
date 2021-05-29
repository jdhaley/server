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
		use: {
			type$Naming: "/base.youni.works/util/Naming"
		},
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
		type$: "View",
		conf: {
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
			if (width < this.conf.minWidth) width = this.conf.minWidth;
			if (height < this.conf.minHeight) height = this.conf.minHeight;
			this.style.width = width + "px";
			this.style.height = height + "px";
		},
		drawShape: function() {
			this.peer.scrollIntoView();
		},
		extend$actions: {
			drawShape: function(event) {
				this.drawShape();
			},
			move: function(event) {
				this.moveTo(this.model.x + event.moveX, this.model.y + event.moveY);
			},
			size: function(event) {
				let model = this.model;
				switch (this.horiz) {
					case "L":
//						if (cmd.before.width - event.trackX < this.conf.minWidth) break;
						this.moveTo(model.x + event.moveX, model.y);
						this.sizeTo(model.width - event.moveX, model.height);
						break;
					case "R":
						this.sizeTo(model.width + event.moveX, model.height);
						break;
				}
				switch (this.vert) {
					case "T":
//						if (cmd.before.height - event.trackY < this.minHeight) break;
						this.moveTo(model.x, model.y + event.moveY);
						this.sizeTo(model.width, model.height - event.moveY);
						break;
					case "B":
						this.sizeTo(model.width, model.height + event.moveY);
						break;
				}
			},
			mousedown: function(event) {
				if (this.owner.activeElement.parentNode == this.peer) return;
				event.preventDefault();
				event.track = this; // Tell the listener what to track.
				pkg.setZone(this, event);
				this.style.outline = "3px solid rgba(64, 128, 64, .3)";
				this.style.zIndex = "1";
				this.diagram.peer.focus();
				if (this.diagram.command) console.log("no mouse up");
			},
			track: function(event) {
				let cmd = this.diagram.command;
				if (!cmd) {
					cmd = this.use.DrawCommand.instance(this);
					this.diagram.command = cmd;
				}
				if (this.vert == "C" && this.horiz == "C") {
					event.subject = "move";
					this.receive(event);
				} else if (event.altKey) {
					event.subject = "connect";
					this.receive(event);
				} else {
					event.subject = "size";
					this.receive(event);
				}
				this.owner.notify(this, "drawShape");
			},
			trackEnd: function(event) {
				event.subject = "";
				this.style.outline = "";
				this.style.cursor = "";
				this.style.zIndex = "";
				if (this.diagram.command) {
					this.set(this.diagram.command.after, this.model);
					this.diagram.commands.addCommand(this.diagram.command);
					this.diagram.command = null;
				} else if (this.peer.firstChild) {
					this.peer.firstChild.focus();
				}
			},
			mousemove: function(event) {
				//Don't alter the cursor when a textShape has the focus.
				//if (this.owner.activeElement.parentNode == this) return;
				if (!this.diagram.command) {
					pkg.setZone(this, event);		
				}
			},
		},
		setZone: function(event) {
			let border = this.conf.border;
			let rect = this.peer.getBoundingClientRect();
	
			let horiz = event.clientX - rect.x;
			let vert = event.clientY - rect.y;
	
			this.vert = "C";
			if (vert < border) {
				this.vert = "T";
			} else if (vert > rect.height - border) {
				this.vert = "B";
			}
			
			this.horiz = "C"
			if (horiz < border) {
				this.horiz = "L"
			} else if (horiz > rect.width - border) {
				this.horiz = "R"
			}
			this.style.cursor = pkg.ZONE_CURSOR[this.vert + this.horiz];
		}	
	}
}