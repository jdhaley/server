export default {
    Zoned: {
        type$: "",
        extend$conf: {
			border: 6
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
		},
        extend$actions: {

        }
    },
	Shape: {
		type$: "Zoned",
		extend$actions: {
			grab: function(event) {
				let b = this.bounds;
				this.peer.$tracking = {
					insideX: event.x - b.left,
					insideY: event.y - b.top
				}
                if (event.altKey) {
					event.track = this;
					this.peer.$tracking.subject = "position";
					this.owner.style.cursor = "move";
				} else if (this.getZone(event.clientX, event.clientY, this.conf.border) == "BR") {
					event.track = this;
					this.peer.$tracking.subject = "size";
					this.style.cursor = "nwse-resize";
				}
			},
			drag: function(event) {
				event.subject = this.peer.$tracking.subject;
				this.receive(event)
			},
			release: function(event) {
				delete this.peer.$tracking;
                this.owner.style.removeProperty("cursor");
			},
			position: function(event) {
				if (event.track == this) {
					this.bounds = {
						left: event.x - this.peer.$tracking.insideX,
						top: event.y - this.peer.$tracking.insideY
					}
				}
			},
			size: function(event) {
				if (event.track == this) {
					let b = this.bounds;
					this.bounds = {
						width: event.clientX - b.left,
						height: event.clientY - b.top
					}
				}
			},
			mousemove: function(event) {
				//Hit test in bottom right (BR) zone to track movement.
				if (event.altKey) {
					this.style.cursor = "move";
				} else if (this.getZone(event.clientX, event.clientY, this.conf.border) == "BR") {
					this.style.cursor = "nwse-resize";
				} else {
					this.style.removeProperty("cursor");
				}
			}
		}
	},
	type$View: "/view/View",
	Pane: {
		type$: ["View", "Shape"],
		get$elementType: function() {
			return this.conf.elementType;
		},
		get$elementConf: function() {
			return this.conf;
		},
		draw: function draw() {
			this.super(draw);
			let type = this.elementType;
			let conf = this.elementConf;
			let control = this.owner.create(type, conf);
			this.append(control);
			return control;
		},
		extend$actions: {
			mousemove: function(event) {
				//Hit test in bottom right (BR) zone to track movement.
				if (this.getZone(event.clientX, event.clientY, this.conf.border) == "BR") {
					this.style.cursor = "nwse-resize";
				} else if (event.altKey || event.target == this.peer) {
					this.style.cursor = "move";
				} else {
					this.style.removeProperty("cursor");
				}
			},
			grab: function(event) {
				let b = this.bounds;
				this.peer.$tracking = {
					insideX: event.x - b.left,
					insideY: event.y - b.top
				}
                if (this.getZone(event.clientX, event.clientY, this.conf.border) == "BR") {
					event.track = this;
					this.peer.$tracking.subject = "size";
					this.style.cursor = "nwse-resize";
				} else if (event.altKey || event.target == this.peer) {
					event.track = this;
					this.peer.$tracking.subject = "position";
					this.owner.style.cursor = "move";
				}
			}
		}
	}
}