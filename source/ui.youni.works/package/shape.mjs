export default {
    Zoned: {
        type$: "",
        extend$conf: {
			zone: {
				border: {
					top: 0,
					right: 6,
					bottom: 6,
					left: 0
				},
				cursor: {
					// "TL": "move",
					// "TC": "move",
					// "TR": "move",
					// "CL": "move",
					// "CC": "move",
					// "CR": "move",
					// "BL": "move",
					// "BC": "move",
					"BR": "nwse-resize",
				},
				subject: {
					// "TL": "position",
					// "TC": "position",
					// "TR": "position",
					// "CL": "position",
					// "CC": "position",
					// "CR": "position",
					// "BL": "position",
					// "BC": "position",
					"BR": "size",
				}
			}
		},
        getZone(x, y) {
			let rect = this.peer.getBoundingClientRect();
			let border = this.conf.zone.border;
			x -= rect.x;
			y -= rect.y;
			let zone;

			if (y < border.top) {
				zone = "T";
			} else if (y > rect.height - border.bottom) {
				zone = "B";
			} else {
				zone = "C";
			}
			if (x < border.left) {
				zone += "L";
			} else if (x > rect.width - border.right) {
				zone += "R";
			} else {
				zone += "C";
			}
			return zone;
		}
    },
	Shape: {
		type$: "Zoned",
		extend$actions: {
			grab(event) {
				if (event.track && event.track != this) return;
				let zone = this.getZone(event.clientX, event.clientY);
				let subject = this.conf.zone.subject[zone] || "";
				if (!subject) return;
				this.style.cursor = this.conf.zone.cursor[zone];
				let b = this.bounds;
				this.peer.$tracking = {
					subject: subject,
					cursor: this.style.cursor,
					insideX: event.x - b.left,
					insideY: event.y - b.top
				}
				event.track = this;
			//	event.subject = "";
			},
			drag(event) {
				event.subject = this.peer.$tracking.subject;
				this.receive(event)
			},
			release(event) {
				delete this.peer.$tracking;
                this.owner.style.removeProperty("cursor");
			},
			position(event) {
				if (event.track == this) {
					this.bounds = {
						left: event.x - this.peer.$tracking.insideX,
						top: event.y - this.peer.$tracking.insideY
					}
				}
			},
			size(event) {
				if (event.track == this) {
					let b = this.bounds;
					this.bounds = {
						width: event.clientX - b.left,
						height: event.clientY - b.top
					}
				}
			},
			moveover(event) {
				let zone = this.getZone(event.clientX, event.clientY);
				let cursor = this.conf.zone.cursor[zone];
				if (cursor) {
					this.style.cursor = cursor;
				} else {
					this.style.removeProperty("cursor");
				}
			}
		}
	},
	type$Display: "/view/Display",
	Pane: {
		type$: ["Display", "Shape"],
		extend$conf: {
			zone: {
				border: {
					top: 0,
					right: 8,
					bottom: 12,
					left: 0
				},
				cursor: {
					"BC": "move",
					"BR": "nwse-resize",
				},
				subject: {
					"BC": "position",
					"BR": "size",
				}
			},	
		},
		get$contentType() {
			return this.conf.contentType;
		},
		get$elementConf() {
			return this.conf;
		},
		draw() {
			this.super(draw);
			let type = this.contentType;
			let conf = this.elementConf;
			let control = this.owner.create(type, conf);
			this.append(control);
			return control;
		}
	}
}