export default {
	type$: "/base/control",
	DomOwner: {
		type$: "Owner",
		document: null,
		get$peer: function() {
			return this.document.body;
		},
		get$location: function() {
			return this.document.location;
		},
		createNode: function(name) {
			if (name.indexOf("/") >= 0) {
				let idx = name.lastIndexOf("/");
				return this.document.createElementNs(name.substring(0, idx), name.substring(idx + 1));
			} else {
				return this.document.createElement(name);
			}
		},
		sense: function sense(on, event) {
			this.super(sense, on, event);
			if (event.preventDefault && !event.subject) event.preventDefault();
		},
		prepareSignal: function prepareSignal(signal) {
			signal = this.super(prepareSignal, signal);
			signal.stopPropagation && signal.stopPropagation();
			if (!signal.subject) signal.subject = signal.type;
			return signal;
		}
	},
	DomNode: {
		type$: "Node",
		type$owner: "DomOwner",
		once$nodeName: function() {
			return this.className;
		},
		once$className: function() {
			return this[Symbol.toStringTag].charAt(0).toLowerCase() + this[Symbol.toStringTag].substring(1);
		},
		get$to: function() {
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
		get$of: function() {
			return this.peer.parentNode.$peer;
		},
		once$peer: function() {
			let peer = this.owner.createNode(this.nodeName);
			peer.$peer = this;
			return peer;
		},
		append: function(control) {
			this.peer.append(control.peer);
		}
	}
}