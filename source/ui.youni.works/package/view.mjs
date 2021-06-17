const pkg = {
	type$: "/dom/dom",
	View: {
		type$: "HtmlElement",
		type$owner: "Frame",
		virtual$model: function() {
			if (arguments.length) {
				this.peer.$model = arguments[0];
				return;
			}
			return this.peer.$model;
		},
		unbind: function() {
			this.model = undefined;
		},
		bind: function(model) {
			this.model = model;
		},
		bindElement: function(view) {
			view.bind(this.model);
		},
		view: function(data) {
			this.unbind();
			this.draw();
			this.bind(data);
			this.owner.send(this, "view");
		},
		extend$actions: {
			view: function(event) {
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
		get$owner: function() {
			return this;
		},
		$window: null,
		get$document: function() {
			return this.$window.document;
		},
		get$activeElement: function() {
			return this.document.activeElement;
		},
		get$selectionRange: function() {
			let selection = this.$window.getSelection();
			if (selection && selection.rangeCount) {
				return selection.getRangeAt(0);
			}
			return this.document.createRange();
		},
		link: function(attrs) {
			let ele = this.createNode("link");
			for (let attr in attrs) {
				ele.setAttribute(attr, attrs[attr]);
			}
			this.peer.ownerDocument.head.append(ele);
		},              
		toPixels: function(measure) {
			let node = this.createNode("div");
			node.style.height = measure;
			this.peer.appendChild(node);
			let px = node.getBoundingClientRect().height;
			node.parentNode.removeChild(node);
			return px;
		},
		start: function(conf) {
			this.let("$window", conf.window);
			this.document.body.$peer = this;
			//console.log(this.toPixels("1mm"), this.toPixels("1pt"), this.toPixels("1in"));
			let events = conf.events();
			pkg.addEvents(this.$window, events.windowEvents);
			pkg.addEvents(this.document, events.documentEvents);

			pkg.addEvents(this.$window, conf.gdr);
		},
		viewOf: function(node) {
			while(node) {
				if (node.$peer) return node.$peer;
				node = node.parentNode;
			}
		},
		viewAt: function(x, y) {
			let target = this.$window.document.elementFromPoint(x, y);
			return this.viewOf(target);
		}
	},
	setAttributes: function(ele, at) {
		//TODO if attribute is an object, prefix the path iterator over it.
		//above can handle the custom data attributes for html.
		if (at) for (let name in at) peer.setAttribute(name, at[name]);
	},
	addEvents: function(peer, events) {
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