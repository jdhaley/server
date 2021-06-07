export default {
            // dragstart: function(event) {
            // },
            // dragover: function(event) {
            //     event.dataTransfer.dropEffect = "move";
            //     event.preventDefault();
            // },
            // drop: function(event) {
            //     this.peer.textContent = "DROP";
            //     event.preventDefault();
            // }

    Track: {
        type$: "View",
        type$source: "View",
        actions: {
            drag: function(event) {
                this.peer.hidden = true;
                let target = this.owner.viewAt(event.clientX, event.clientY);
                this.peer.hidden = false;
                if (target) this.owner.sense(target, /*create event*/);
             },
            drop: function(event) {
            }
        }
    },
    ColumnTrack: {

    },
    Droppable: {
		type$: "Zoned",
        extend$actions: {
            dragover: function(event) {
            },
            drop: function(event) {
                console.log("drop");
            }
        }
    },
    Draggable: {
		type$: "Zoned",
        extend$actions: {
            dragstart: function(event) {
            }
        }
    },
	Sizeable: {
		type$: "Zoned",
		extend$conf: {
			border: 6,
			minWidth: 48,
			minHeight: 24	
		},
		moveTo: function(x, y) {
			if (x < 0) x = 0;
			if (y < 0) y = 0;
            //could also set? position: "absolute"
			this.style.left = x + "px";
			this.style.top = y + "px";
		},
		sizeTo: function(width, height) {
			if (width < this.conf.minWidth) width = this.conf.minWidth;
			if (height < this.conf.minHeight) height = this.conf.minHeight;
			this.style.width = width + "px";
			this.style.height = height + "px";
		},
        // x & y are viewport (client) co-ordinates.
        startTrack: function(x, y) {
            return this.getZone(x, y, this.conf.border) == "BR";
        },
		extend$actions: {
			size: function(event) {
				this.sizeTo(event.width, event.height);
			},
			mousemove: function(event) {
				//Hit test in bottom right (BR) zone to track movement.
				if (this.getZone(event.clientX, event.clientY, this.conf.border) == "BR") {
					this.style.cursor = "nwse-resize";
				} else {
					this.style.removeProperty("cursor");
				}
			},
			mousedown: function(event) {
                if (this.startTrack(event.clientX, event.clientY)) event.track = this;
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
		}
	},
	Moveable: {
        type$: "",
		moveTo: function(x, y) {
			if (x < 0) x = 0;
			if (y < 0) y = 0;
            this.style.position = "absolute"
			this.style.left = x + "px";
			this.style.top = y + "px";
		},
		extend$actions: {
			move: function(event) {
				this.moveTo(event.left, event.top);
			},
			mousemove: function(event) {
				//Hit test in bottom right (BR) zone to track movement.
				if (event.altKey) {
					this.style.cursor = "move";
				} else {
					this.style.removeProperty("cursor");
				}
			},
			mousedown: function(event) {
                console.log(event);
                if (event.altKey) event.track = this;
			},
			track: function(event) {
				this.owner.style.cursor = "move";
				event.left = event.clientX;
				event.top = event.clientY;
				event.subject = "move";
				this.receive(event);
			},
			trackEnd: function(event) {
				event.subject = "";
                this.owner.style.removeProperty("cursor");
			}
		}
	},
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
		extend$conf: {
			border: 6,
			minWidth: 48,
			minHeight: 24	
		},
		sizeTo: function(width, height) {
			if (width < this.conf.minWidth) width = this.conf.minWidth;
			if (height < this.conf.minHeight) height = this.conf.minHeight;
			this.style.width = width + "px";
			this.style.height = height + "px";
		},
		moveTo: function(x, y) {
			if (x < 0) x = 0;
			if (y < 0) y = 0;
            this.style.position = "absolute"
			this.style.left = x + "px";
			this.style.top = y + "px";
		}
	}
}