export default {
    type$: "/cell",
    Caption: {
        type$: ["Display", "Shape"]
    },
    Panel: {
		type$: ["Display", "Shape"],
		members: {
			type$header: "Caption2",
			type$body: "Display",
			type$footer: "Display"
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
		},
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
}