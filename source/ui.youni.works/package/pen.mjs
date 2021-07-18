export default {
	Graphic: {
		var$markup: "",
		draw() {
			this.markup = "";
		}
	},
	Path: {
		type$: "Graphic",
		var$path: "",
		get$markup() {
			this.draw();
			return `<path d="${this.path}"/>`
		},
		mv(x, y) {
			this.path += `M${x},${y} `;
		},
		ln(x, y) {
			this.path += `L${x},${y} `;
		},
		v(x, y) {
			this.path += `l${x},${y} `;
		},
		c(cx, cy, x, y) {
			this.path += `Q${cx},${cy} ${x},${y} `;
		},
	},
	Circle: {
		type$: "Graphic",
		var$x: 0,
		var$y: 0,
		var$r: 0,
		get$markup() {
			return `<circle cx="${this.x}" cy="${this.cy}" r="${this.r}"/>`
		}
	},
	Grid: {
		type$: "Path",
		draw() {
			for (let y = 0; y <= 320; y += 10) {
				this.mv(0, y);
				this.ln(320, y);
			}
			for (let x = 0; x <= 320; x += 10) {
				this.mv(x, 0);
				this.ln(x, 320);
			}
		},
	},
	Shape: {
		type$: "/display/Display",
		get$image() {
			for (let node = this.peer; node; node = node.parentNode) {
				if (node.nodeName == "svg") return node.$peer;
			}
		},
		get$nodeName() {
			return "http://www.w3.org/2000/svg/" + this.name
		},
		name: "",
		get(name) {
			this.peer.getAttribute(name);
		},
		set(name, value) {
			this.peer.setAttribute(name, value);
		},
		// markup: "",
		// display() {
		// 	this.super(display);
		// 	this.draw();
		// 	this.peer.innerHTML = this.markup;
		// },
		// draw() {
		// }
	},
	Point: {
		type$: ["Shape", "Circle"],
		name: "circle",
		var$cmd: "",
		at: {
			r: 3,
			class: "point"
		},
		virtual$x() {
			if (!arguments.length) return this.get("cx");
			this.set("cx", arguments[0]);
		},
		virtual$y() {
			if (!arguments.length) return this.get("cy");
			this.set("cy", arguments[0]);
		},
		extend$actions: {
			grab(event) {
				event.track = this;
				event.preventDefault();
			},
			drag(event) {
				let b = this.image.bounds;
				this.x = Math.round((event.x - b.left) / b.width * 32) * 10;
				this.y = Math.round((event.y - b.top) / b.height * 32) * 10;
			},
		}
	},
	Image: {
		type$: "Shape",
		name: "svg",
		at: {
			class: "icon",
			viewBox: "0 0 320 320"
		},
		type$grid: "Grid",
		display() {
			this.peer.innerHTML = this.grid.markup;
		},
		var$points: null,
		var$vector: "",
		extend$actions: {
			moveover(event) {
				let r = this.bounds;
				let x = Math.round((event.x - r.left) / r.width * 320);
				let y = Math.round((event.y - r.top) / r.height * 320);
				//console.log(x, y);
			},
			contextmenu(event) {
				event.preventDefault();
			},
			dblclick(event) {
				console.log(event.buttons);
				let point = this.owner.create("/pen/Point");
				if (!this.points) {
					this.points = [point];
					point.cmd = "m";
				} else {
					this.points.push(point);
					point.cmd = "l";
				}
				this.append(point);
				let b = this.bounds;
				point.x = Math.round((event.x - b.left) / b.width * 32) * 10;
				point.y = Math.round((event.y - b.top) / b.height * 32) * 10;
				point.display();

			}
		}

	},
	Canvas: {
		type$: "/display/Display",
		var$shape: null,
		display() {
			this.super(display);
			this.shape = this.owner.create("/pen/Image");
			this.append(this.shape);
		},
	}
}