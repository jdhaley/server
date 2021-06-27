export default {
	type$: "/base/control",
	Document: {
		type$: "Owner",
		document: null,
		get$peer() {
			return this.document.body;
		},
		get$location() {
			return this.document.location;
		},
		createNode(name) {
			if (name.indexOf("/") >= 0) {
				let idx = name.lastIndexOf("/");
				return this.document.createElementNs(name.substring(0, idx), name.substring(idx + 1));
			} else {
				return this.document.createElement(name);
			}
		},
		sense(on, event) {
			this.super(sense, on, event);
			if (event.preventDefault && !event.subject) event.preventDefault();
		},
		prepareSignal(signal) {
			signal = this.super(prepareSignal, signal);
			signal.stopPropagation && signal.stopPropagation();
			if (!signal.subject) signal.subject = signal.type;
			return signal;
		}
	},
	Element: {
		type$: "Node",
		type$owner: "Document",
		once$nodeName() {
			return this.className;
		},
		once$className() {
			return this[Symbol.toStringTag].charAt(0).toLowerCase() + this[Symbol.toStringTag].substring(1);
		},
		get$to() {
			const nodes = this.peer.childNodes;
			if (!nodes.$to) nodes.$to = this[Symbol.for("owner")].create({
				symbol$iterator: function*() {
					for (let i = 0, len = nodes.length; i < len; i++) {
						let node = nodes[i];
						if (node.$peer) yield node.$peer;
					}
				}
			});
			return nodes.$to;
		},
		/**
		 * Dom Nodes are rooted tree nodes, i.e. more-or-less equivalent to an undirected graph.
		 * "of" is a generic whole-part relationship and for Dom Nodes the default is its parentNode.
		 */
		get$of() {
			return this.peer.parentNode.$peer;
		},
		once$peer() {
			let peer = this.owner.createNode(this.nodeName);
			peer.$peer = this;
			return peer;
		},
		append(control) {
			this.peer.append(control.peer);
		}
	},
	HtmlElement: {
		type$: "Element",
		nodeName: "div",
		extend$conf: {
			minWidth: 0,
			minHeight: 0	
		},
		get$style() {
			return this.peer.style;
		},
		draw() {
			this.peer.textContext = "";
			this.peer.classList.add(this.className);
		},
		virtual$bounds() {
			if (arguments.length) {
				let rect = arguments[0];
				if (rect.width !== undefined) this.style.width = Math.max(rect.width, this.conf.minWidth) + "px";
				if (rect.height !== undefined) this.style.height = Math.max(rect.height, this.conf.minHeight) + "px";		
				if (rect.left !== undefined || rect.top !== undefined) this.style.position = "absolute";
				if (rect.left !== undefined) this.style.left = rect.left + "px";
				if (rect.top !== undefined) this.style.top = rect.top + "px";
			} else {
				return this.peer.getBoundingClientRect();
			}
		}
	}
}