export default {
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
					this.style.removeProperty("cursor");
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
                this.owner.style.removeProperty("cursor");
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