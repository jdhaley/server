//facet$name - protected
//facet_name - public

export default {
			const: function(decl) {
				decl.configurable = true;
				decl.enumerable = true;
				decl.value = this.compile(decl.expr);
				decl.define = function(object) {
					return Reflect.defineProperty(object, this.name, this);
				}
				return decl;
			},
			var: function(decl) {
				let value = this.compile(decl.expr);
				decl.configurable = true;
				decl.enumerable = true;
				decl.get = function getVar() {
					return value;
				}
				decl.set = function setVar(value) {
					Reflect.defineProperty(this, decl.name, {
						configurable: true,
						enumerable: true,
						writable: true,
						value: value
					});
				}
				decl.define = function(object) {
					return Reflect.defineProperty(object, this.name, this);
				}
				return decl;
			},
			get: function(decl) {
				decl.configurable = true;
				decl.enumerable = true;
				if (typeof decl.expr == "function") {
					decl.get = decl.expr;				
				} else {
					console.warn("get facet requires a function. Creating a value property instead.");
					decl.value = this.compile(decl.expr);
				}
				decl.define = function(object) {
					return Reflect.defineProperty(object, this.name, this);
				}
				return decl;
			},
			virtual: function(decl) {
				decl.configurable = true;
				decl.enumerable = true;
				if (typeof decl.expr == "function") {
					decl.get = decl.expr;
					decl.set = decl.expr;
				} else {
					console.warn("virtual facet requires a function. Creating a value property instead.");
					decl.value = this.compile(decl.expr);
				}
				decl.define = function(object) {
					return Reflect.defineProperty(object, this.name, this);
				}
				return decl;
			},
			once: function(decl) {
				decl.configurable = true;
				const source = decl.expr;
				if (typeof source != "function") {
					console.error("once facet requires a function. Creating a value property instead.");
					source = this.compile(source);
				}
				decl.set = function setOnce(value) {
					Reflect.defineProperty(this, decl.name, {
						configurable: true,
						enumerable: true,
						writable: true,
						value: value
					});
				}
				decl.get = function getOnce() {
					let value = source.call(this);
					decl.set.call(this, value);
					return value;
				};
				decl.define = function(object) {
					return Reflect.defineProperty(object, this.name, this);
				}
				return decl;
			},
			type: function(decl) {
				if (typeof decl.expr != "string") {
					throw new Error("type facet requires a string.");
				}
				let owner = this;
				decl.configurable = true;
				decl.enumerable = true;
				decl.get = function getType() {				
					return owner.forName(decl.expr);
				}
				decl.define = function(object) {
					return Reflect.defineProperty(object, this.name, this);
				}
				return decl;
			},
			extend: function(decl) {
				if (typeof decl.expr != "object") throw new Error("extend facet requires an object expression.");
				let owner = this;
				decl.define = function(object) {
					let ext = owner.extend(object[decl.name] || null, decl.expr);
					return owner.define(object, decl.name, ext, "const");
				}
				return decl;
			},
			symbol: function(decl) {
				decl.symbol = this.symbolOf(decl.name);
				if (!decl.symbol) throw new Error(`Symbol "${decl.name}" is not defined.`);
				decl.configurable = true;
				decl.value = this.compile(decl.expr);
				decl.define = function(object) {
					delete object[this.name];
					return Reflect.defineProperty(object, this.symbol, this);
				}
				return decl;
			}
}