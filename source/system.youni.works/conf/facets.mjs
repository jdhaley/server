//facet$name - protected
//facet_name - public

export default {
			const: function(decl) {
				decl.value = decl.expr;
				return decl;
			},
			var: function(decl) {
				decl.enumerable = true;
				decl.get = function getVar() {
					return decl.expr;
				}
				decl.set = function setVar(value) {
					Reflect.defineProperty(this, decl.name, {
						configurable: true,
						enumerable: true,
						writable: true,
						value: value
					});
				}
				return decl;
			},
			get: function(decl) {
				decl.enumerable = true;
				if (typeof decl.expr == "function") {
					decl.get = decl.expr;				
				} else {
					console.warn("get facet requires a function. Creating a value property instead.");
					decl.value = decl.expr;
				}
				return decl;
			},
			virtual: function(decl) {
				decl.enumerable = true;
				if (typeof decl.expr == "function") {
					decl.get = decl.expr;
					decl.set = decl.expr;
				} else {
					console.warn("virtual facet requires a function. Creating a value property instead.");
					decl.value = decl.expr;
				}
				return decl;
			},
			once: function(decl) {
				const source = decl.expr;
				if (typeof source != "function") {
					console.error("once facet requires a function. Creating a value property instead.");
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
					//sys2 rollout 
					if (this[Symbol.status]) {
						console.error("once$ called during compile.");
						return;
					}
					let value = source.call(this);
					decl.set.call(this, value);
					return value;
				};
				return decl;
			},
			type: function(decl) {
				if (typeof decl.expr != "string") {
					throw new Error("type facet requires a string.");
				}
				decl.enumerable = true;
				decl.value = decl.expr ? decl.sys.forName(decl.expr, decl[decl.sys.conf.symbols.name]) : null;
				return decl;
			},
			extend: function(decl) {
				if (typeof decl.expr != "object") throw new Error("extend facet requires an object expression.");
				let sys = decl.sys;
				decl.enumerable = true;
				decl.get = function() {
					let proto = Object.getPrototypeOf(this);
					let value = sys.extend(proto ? proto[decl.name] : null);
					if (this.interface) for (let type of this.interface.implements) {
						sys.implement(value, type.class[decl.name]);
					}
					sys.implement(value, decl.expr);
					Reflect.defineProperty(this, decl.name, {
						configurable: true,
						enumerable: true,
						value: value
					});
					return value;
				}
				return decl;
			},
			symbol: function(decl) {
				decl.symbol = decl.sys.conf.symbols[decl.name];
				if (!decl.symbol) throw new Error(`Symbol "${decl.name}" is not defined.`);
				decl.value = decl.expr;
				decl.sys.define(decl, "define", defineSymbol);
				return decl;

				function defineSymbol(object) {
					delete object[this.name];
					Reflect.defineProperty(object, this.symbol, this);
				}
			}
}