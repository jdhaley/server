export default {
	type$: "/base.youni.works/util",
    App: {
        type$: ["Control", "Origin"],
        type$owner: "Owner",
        start: function(conf) {
            this.let("conf", conf);
            let manifest = "/file/" + conf.window.location.search.substring(1) + "/app.json";
            this.open(manifest, "initializeApp");
        },
        initializeOwner: function() {
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
        // test: function() {
        //     let pane = this.owner.create("/ui.youni.works/container/Pane", {
        //         elementType: {
        //             type$: "/ui.youni.works/container/Collection",
        //             className: "list",
        //             elementType: "/ui.youni.works/container/Value"
        //         }
        //     });
        //     this.owner.append(pane);
        //     pane.view({
        //         "a": "Apple",
        //         "b": "Orange",
        //         "c": "Grape"
        //     });
        // },
        extend$actions: {
            view: function(msg) {
                this.view.view(this.data);
            },
            initializeApp: function(msg) {
                let conf = this.sys.extend(this.conf, JSON.parse(msg.response));
                this.let("conf", conf);
                this.let("owner", this.sys.extend(conf.ownerType || this.owner));
                this.initializeOwner();

                if (conf.typeSource) {
                    this.open(conf.typeSource, "initializeTypes");                 
                } else {
                    this.owner.send(this, "initializeTypes");
                }
                this.open(conf.dataSource, "initializeData");
//               this.test();
            },
            initializeTypes: function(msg) {
                if (msg.response) {
                    let types = JSON.parse(msg.response);
                    this.types = this.sys.extend(null, types);    
                } else {
                    this.types = Object.create(null);
                }
                //Create the view after the types have been initialized
                this.view = this.owner.create(this.conf.components.Object, this.types[this.conf.objectType]);
                this.view.file =  this.conf.dataSource;
                this.owner.append(this.view);
                if (this.data) this.receive("view");
            },
            initializeData: function(msg) {
                let data = JSON.parse(msg.response);
                this.data = this.sys.extend(null, data);
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
