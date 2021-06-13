export default {
    type$: "/ui/base/control",
    type$origin: "/ui/base/origin",
    App: {
        type$: ["Control", "origin/Origin", "Factory"],
        type$owner: "Owner",
        get$folder: function() {
            let name = this.conf.window.location.pathname;
            name = name.substring(name.lastIndexOf("/") + 1);
            name = name.substring(0, name.lastIndexOf("."));
            return "/file/" + name;
        },
        runScript: function(name) {
            import(name).then(v => {
                v.default.call(this);
            });
        },
        start: function(conf) {
            this.let("conf", conf);
            this.open(this.folder + "/app.json", "initializeApp");
            this.runScript(this.folder + "/index.mjs");
         },
        initializeOwner: function() {
            this.owner.origin = this;
            this.owner.editors = this.conf.editors;
            this.owner.start(this.conf);
            if (this.conf.icon) this.owner.link({
                rel: "icon",
                href: this.conf.icon
            });
            if (this.conf.styles) this.owner.link({
                rel: "stylesheet",
                href: this.conf.styles
            });
        },
        extend$actions: {
            view: function(msg) {
                this.view.view(this.data[this.conf.dataset]);
            },
            initializeApp: function(msg) {
                let conf = msg.response 
                    ? this.create(this.conf, JSON.parse(msg.response)) 
                    : this.create();
                this.let("conf", conf);
                this.let("owner", this.create(conf.ownerType || this.owner));
                this.initializeOwner();

                if (conf.typeSource) {
                    this.open(conf.typeSource, "initializeTypes");                 
                } else {
                    this.owner.send(this, "initializeTypes");
                }
                this.open(conf.dataSource, "initializeData");
            },
            initializeTypes: function(msg) {
                if (msg.response) {
                    let types = JSON.parse(msg.response);
                    this.types = this.create(types);    
                } else {
                    this.types = this.create();
                }
                //Create the view after the types have been initialized
                this.view = this.owner.create(this.conf.components.Object, this.types[this.conf.objectType]);
                this.view.file =  this.conf.dataSource;
                this.owner.append(this.view);
                if (this.data) this.receive("view");
            },
            initializeData: function(msg) {
                let data = JSON.parse(msg.response);
                this.data = this.create(data);
                if (this.view) this.receive("view");
            }
       }
    }
}


//this.window.styles = createStyleSheet(this.window.document);
//createRule: function(selector, properties) {
//	let out = `${selector} {\n`;
//	out += defineStyleProperties(properties);
//	out += "\n}";
//	let index = this.window.styles.insertRule(out);
//	return this.window.styles.cssRules[index];
//},

function createStyleSheet(document) {
	let ele = document.createElement("style");
	ele.type = "text/css";
	document.head.appendChild(ele);
	return ele.sheet;
}

function defineStyleProperties(object, prefix) {
	if (!prefix) prefix = "";
	let out = "";
	for (let name in object) {
		let value = object[name];
		if (typeof value == "object") {
			out += defineStyleProperties(value, prefix + name + "-");
		} else {
			out += "\t" + prefix + name + ": " + value + ";\n"
		}
	}
	return out;
}
