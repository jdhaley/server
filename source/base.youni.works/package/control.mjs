export default {
	type$: "/system/core",
	Control: {
		type$: "Instance",
		conf: {
		},
		start(conf) {
			if (conf) this.let("conf", conf, "extend");
		},
		receive(signal) {
			let action = this.actions[typeof signal == "string" ? signal : signal.subject];
			action && action.call(this, signal);			
		},
		actions: {
		}
	},
	Node: {
		type$: "Control",
		type$owner: "Owner",	//The graph.
		type$to: "Array",		//The arcs. Each arc should be a Node.
		append(component) {
			Array.prototype.push.call(this.to, component);
		},
		forEach(data, method) {
			if (data && data[Symbol.iterator]) {
				let i = 0;
				for (let datum of data) {
					method.call(this, datum, i++, data);
				}
			} else {
				for (let name in data) {
					method.call(this, data[name], name, data);
				}
			}
		}
	},
	Owner: {
		create(controlType, conf) {
			let module = this[Symbol.for("owner")];
			let control = module.create(controlType);
			module.define(control, "owner", this, "const");
			control.start(conf);
			return control;
		},
		send(to, msg) {
			if (to.owner != this) console.warn("sending to a node not owned by this.");
			msg = this.prepareSignal(msg);
			this.log(to, msg);
			msg && down(to, msg);

			function down(on, message) {
				if (!message.subject) return;
				on.receive(message);
				if (message.pushPath) message.pushPath(on);
				if (on.to) for (on of on.to) {
					down(on, message);
				}
			}			
		},
		sense(on, event) {
			if (on.owner != this) console.warn("sensing on a node not owned by this.");
			event = this.prepareSignal(event);
			this.log(on, event);
			let ele = on.peer
			//can't use event.path - it is chrome-specific.
			while (on) {
				if (!event.subject) return;
				on.receive(event);
				on = on.of;
			}
		},
		notify(on, signal) {
			let model = signal.model || on.model;
			let observers = model && model[Symbol.for("observers")];
			if (!observers) return;
			signal = this.prepareSignal(signal);
			for (let ctl of observers) {
				//Set the following for each iteration in case of a bad behaving control.
				signal.source = on;
				signal.model = model;
				ctl.receive(signal);
			}
		},
		prepareSignal(signal) {
			if (typeof signal != "object") return {
				subject: signal
			}
			return signal;
		},
		log(on, event) {
			// const DONTLOG = ["receive", "track", "mousemove", "selectionchange"];
			// for (let subject of DONTLOG) {
			// 	if (event.subject == subject) return;
			// }
			// console.debug(event.subject + " " + on.nodeName + " " + on.className);
		}
	},
	Observer: {
		type$: "",
		observe(object) {
			const OBSERVERS = Symbol.for("observers");
			if (typeof object != "object" || object == null) return; //Only observe objects.
			let observers = object[OBSERVERS];
			if (observers) {
				for (let observer of observers) {
					if (observer == this) return; //Already observing
				}
			} else {
				observers = [];
				object[OBSERVERS] = observers;
			}
			observers.push(this);
		},
		unobserve(control, object) {
			const OBSERVERS = Symbol.for("observers");
			let list = object ? object[OBSERVERS] : null;
			if (list) for (let i = 0, len = list.length; i < len; i++) {
				if (this == list[i]) {
					list.splice(i, 1);
					break;
				}
			}
		}
	}
}