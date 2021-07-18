export default {
    type$: "/control",
	Collection: {
		type$: "View",
		modelOf(contentView) {
			return this.model[contentView.key];
		}
	},
    Structure: {
		type$: "View",
		extend$conf: {
			memberKeyProperty: "name",
			type$members: "" //object or array
		},
		//TODO - work in logic with the extend$ facet (it can accept arrays containing element.name objects)
		//TOOD - re above - more generally - thinking about converting arrays based on key/id value.
		once$members() {
			let members = this.conf.members;
			let keyProp = this.conf.memberKeyProperty || "name";
			if (members && members[Symbol.iterator]) {
				members = Object.create(null);
				for (let member of this.conf.members) {
					let key = member[keyProp];
					if (key) members[key] = member;
				}
			} else {
				for (let key in members) {
					let member = members[key];
					if (!member[keyProp]) member[keyProp] = key;
				}
			}
			return members;
		},
		var$parts: {
		},
		view(model)  {
			this.observe(model);
			this.countWith(this.members, this.createContent);
		},
		createContent(value, key, object) {
			let content = this.super(createContent, value, key, object);
			if (isNaN(+key)) content.peer.classList.add(key);
			this.parts[key] = content;
			return content;
		},
		typeFor(value, key) {
			if (value && typeof value == "object") {
				return value.receive ? value : value.contentType || this.contentType;
			}
			return this[Symbol.for("owner")].forName("" + value) || this.contentType;
		},
		configurationFor(value, key) {
			return value && typeof value == "object" && !value.receive ? value : this.conf;
		}
	}
}