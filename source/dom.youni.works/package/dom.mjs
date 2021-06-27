export default {
	type$: "/base/view",
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
		createId() {
			let id = this.document.$lastId || 0;
			this.document.$lastId = ++id;
			return id;
		},
		link(attrs) {
			let node = this.createNode("link");
			for (let attr in attrs) {
				node.setAttribute(attr, attrs[attr]);
			}
			this.document.head.append(node);
			return node;
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
		type$: "View",
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
	}
}