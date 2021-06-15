export default {
    type$: "/view",
    type$Shape: "/shape/Shape",
	Handle: {
		type$: "View",
		bind: function(model) {
			let key = this.of.peer.$key;
			this.peer.textContent = key;
		}
	},
	Property: {
		type$: ["View", "Shape"],
		use: {
			type$Text: "/base/util/Text"
		},
		getCaption: function() {
			return this.conf.caption || this.use.Text.captionize(this.conf.name);
		},
		draw: function draw() {
			this.super(draw);
			this.peer.classList.add(this.conf.name);
//			let s = +(this.conf.columnSize) || 1;
//			this.style.flex = `${s} 1`;
//			this.style.minWidth = `${s * 3}mm`;
//			this.style.maxWidth = `${s}mm`;
		}
	},
	Cell: {
		type$: "Property",
		get$elementType: function() {
			return this.owner.editors[this.conf.inputType || this.conf.dataType] || this.owner.editors.string;
		},
		bind: function(model) {
			this.model = model && model[this.conf.name];
		},
		draw: function draw() {
			this.super(draw);
			let ele = this.owner.create(this.elementType, this.conf);
			this.append(ele);
		},
		extend$actions: {
			activate: function(event) {
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
		type$: "Property",
		draw: function draw() {
			this.super(draw);
			this.peer.draggable = true;
			this.peer.innerText = this.getCaption();
			if (this.conf.dynamic) this.peer.classList.add("dynamic");
		},
		bind: function(model) {
		}
	}
}