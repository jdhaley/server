export default {
    type$: "/view",
    type$Shape: "/shape/Shape",
	Cell: {
		type$: "View",
		type$textUtil: "/base/util/Text",
		getCaption() {
			return this.conf.caption || this.textUtil.captionize(this.conf.name);
		},
		draw() {
			this.super(draw);
			this.peer.classList.add(this.conf.name);
			let s = +(this.conf.columnSize) || 1;
			this.style.flexBasis = `${s * 5}mm`;
//			this.style.minWidth = `${s}em`;
		}
	},
	Value: {
		type$: "Cell",
		get$elementType() {
			return this.owner.editors[this.conf.inputType || this.conf.dataType] || this.owner.editors.string;
		},
		draw() {
			this.super(draw);
			let ele = this.owner.create(this.elementType, this.conf);
			this.append(ele);
		},
		bind(model) {
			this.model = model && model[this.conf.name];
		},
		extend$actions: {
			activate(event) {
				let model = this.owner.origin.data[this.conf.dataset][this.model];
				let type = this.owner.origin.types[this.conf.objectType];
				let view = this.owner.create(this.conf.linkControl, type);
				this.owner.append(view);
				let b = this.bounds;
				view.bounds = {
					left: b.left,
					top: b.bottom
				};
				view.view(model);
			}
		}
	},
	Caption: {
		type$: ["Cell", "Shape"],
		draw: function draw() {
			this.super(draw);
			if (!this.rule) this.createRule();
			this.peer.draggable = true;
			this.peer.innerText = this.getCaption();
			if (this.conf.dynamic) this.peer.classList.add("dynamic");
		},
		bind: function(model) {
		},
		createRule() {
			if (this.conf.name != "issued") return;
			let selector = "#" + getParentId(this.peer) + " ." + this.conf.name;
			this.rule = this.owner.createStyle(selector, {
				background: "red"
			});

			function getParentId(node) {
				for (; node; node = node.parentNode) {
					if (node.id) return node.id;
				}
			}
		}
	},
	Key: {
		type$: ["Cell", "Shape"],
		bind(model) {
			let key = this.of.peer.$key || "";
			this.peer.textContent = key;
		}
	}
}