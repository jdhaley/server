export default {
	Shape: {
		type$: "/display/Display",
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
	},
	Point: {
		type$: "Shape",
		name: "circle",
		get$graphic() {
			for (let node = this.peer; node; node = node.parentNode) {
				if (node.nodeName == "svg") return node.$peer;
			}
		},
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
				let b = this.graphic.bounds;
				this.x = Math.round((event.x - b.left) / b.width * 32) * 10;
				this.y = Math.round((event.y - b.top) / b.height * 32) * 10;
			},
		}
	},
	Graphic: {
		type$: "Shape",
		name: "svg",
		at: {
			class: "icon",
			viewBox: "0 0 320 320"
		},
		graphic: "",
		display() {
			this.draw();
			this.peer.innerHTML = this.graphic;
		},
		circle(x, y, r) {
			this.peer.innerHTML += `<circle cx="${x}" cy="${y}" r="${r}" fill="green"/>`;
		},
		extend$actions: {
			moveover(event) {
				let r = this.bounds;
				let x = Math.round((event.x - r.left) / r.width * 320);
				let y = Math.round((event.y - r.top) / r.height * 320);
				//console.log(x, y);
			},
			click(event) {
				if (!event.shiftKey) return;
				let point = this.owner.create("/pen/Point");
				this.append(point);
				let b = this.bounds;
				point.x = Math.round((event.x - b.left) / b.width * 32) * 10;
				point.y = Math.round((event.y - b.top) / b.height * 32) * 10;
				point.display();
			}
		}

	},
	Path: {
		type$: "Graphic",
		var$path: "",
		once$graphic() {
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
	Canvas: {
		type$: "/display/Display",
		var$shape: null,
		display() {
			this.super(display);
			this.shape = this.owner.create("/pen/Path");
			this.append(this.shape);
		},
	}
}