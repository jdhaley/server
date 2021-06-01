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
	Pane: {
		type$: "Zoned",
		extend$actions: {
			mousemove: function(event) {
				//Hit test in bottom right (BR) zone to track movement.
				if (event.altKey) {
					this.style.cursor = "move";
				} else if (this.getZone(event.clientX, event.clientY, this.conf.border) == "BR") {
					this.style.cursor = "nwse-resize";
				} else {
					this.style.removeProperty("cursor");
				}
			},
			mousedown: function(event) {
                console.log(event);
                if (event.altKey) {
					event.track = this;
					this.peer.$tracking = "position";
					this.owner.style.cursor = "move";
				} else if (this.getZone(event.clientX, event.clientY, this.conf.border) == "BR") {
					event.track = this;
					this.peer.$tracking = "size";
					this.style.cursor = "nwse-resize";
				}
			},
			click: function(event) {
				console.log(event)
			},
			track: function(event) {
				event.subject = this.peer.$tracking;
				this.receive(event)
			},
			trackEnd: function(event) {
				event.subject = "";
				delete this.peer.$tracking;
                this.owner.style.removeProperty("cursor");
			},
			position: function(event) {
				if (event.track == this) {
					this.bounds = {
						left: event.clientX,
						top: event.clientY,
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
			}
		}
	}
}