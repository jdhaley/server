const pkg = {
	type$: "/dom/dom",
	View: {
		type$: "HtmlElement",
		type$owner: "Frame",
		virtual$model() {
			if (arguments.length) {
				this.peer.$model = arguments[0];
				return;
			}
			return this.peer.$model;
		},
		unbind() {
			this.model = undefined;
		},
		bind(model) {
			this.model = model;
		},
		bindElement(view) {
			view.bind(this.model);
		},
		view(data) {
			this.unbind();
			this.draw();
			this.bind(data);
			this.owner.send(this, "view");
		},
		extend$actions: {
			view(event) {
				for (let view of this.to) {
					view.unbind();
					view.draw();
					this.bindElement(view);
				}
			}
		}
	},
	Frame: {
		type$: ["View", "DomOwner"],
		$window: null,
		//
		get$owner() {
			return this;
		},
		get$document() {
			return this.$window.document;
		},
		get$activeElement() {
			return this.document.activeElement;
		},
		get$selectionRange() {
			let selection = this.$window.getSelection();
			if (selection && selection.rangeCount) {
				return selection.getRangeAt(0);
			}
			return this.document.createRange();
		},
		link(attrs) {
			let ele = this.createNode("link");
			for (let attr in attrs) {
				ele.setAttribute(attr, attrs[attr]);
			}
			this.peer.ownerDocument.head.append(ele);
		},              
		toPixels(measure) {
			let node = this.createNode("div");
			node.style.height = measure;
			this.peer.appendChild(node);
			let px = node.getBoundingClientRect().height;
			node.parentNode.removeChild(node);
			return px;
		},
		createId() {
			let id = this.document.$lastId || 0;
			this.document.$lastId = ++id;
			return id;
		},
		createStyle(selector, object) {
			let out = selector + " {";
			if (object) for (let name in object) {
				out += name + ":" + object[name] + ";"
			}
			out += "}";
			let index = this.document.$styles.insertRule(out);
			return this.document.$styles.cssRules[index];
		},
		start(conf) {
			this.let("$window", conf.window);
			this.document.body.$peer = this;
			let ele = this.document.createElement("style");
			ele.type = "text/css";
			this.document.head.appendChild(ele);
			this.document.$styles = ele.sheet;
			//console.log(this.toPixels("1mm"), this.toPixels("1pt"), this.toPixels("1in"));
			let events = conf.events();
			pkg.addEvents(this.$window, events.windowEvents);
			pkg.addEvents(this.document, events.documentEvents);

			pkg.addEvents(this.$window, conf.gdr);
		},
		viewOf(node) {
			while(node) {
				if (node.$peer) return node.$peer;
				node = node.parentNode;
			}
		},
		viewAt(x, y) {
			let target = this.$window.document.elementFromPoint(x, y);
			return this.viewOf(target);
		}
	},
	setAttributes(ele, at) {
		//TODO if attribute is an object, prefix the path iterator over it.
		//above can handle the custom data attributes for html.
		if (at) for (let name in at) peer.setAttribute(name, at[name]);
	},
	addEvents(peer, events) {
		for (let name in events) {
			let listener = events[name];
			peer.addEventListener(name, listener);
		}
	},
	$public: {
		type$View: "View",
		type$Frame: "Frame"
	}
}
export default pkg;