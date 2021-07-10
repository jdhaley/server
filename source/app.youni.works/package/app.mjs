export default {
    type$: "/ui/base/control",
    type$Origin: "/ui/base/origin/Origin",
    DataConverter: {
        facetOf(decl) {
            if (typeof decl == "symbol") return "";
            decl = "" + decl;
            let index = decl.indexOf("$");
            return index < 0 ? "" : decl.substr(0, index);
        },
        nameOf(decl) {
            if (typeof decl == "symbol") return decl;
            decl = "" + decl;
            let index = decl.indexOf("$");
            return index < 0 ? decl : decl.substring(index + 1);
        },
        memberFor(expr, name, facet) {
            let member = Object.create(null);
            if (expr && expr.type$ == "Function") {
                if (!facet) {
                    member.facet = "method";
                    member.expr = expr.source;
                    return member;
                }
            }
            member.facet  = facet;
            member.expr = this.convert(expr);
            return member;

        },
        membersFor(source) {
            let members = Object.create(null);
            for (let decl in source) {
                let name = this.nameOf(decl);
                let member = this.memberFor(source[decl], name, this.facetOf(decl));
                members[name] = member;
            }
            return members;
        },
        convert(value) {
            if (value && typeof value == "object") {
                if (value.type$ == "Function") {
                    return {
                        facet: "method",
                        expr: value.source
                    }
                }
                return this.membersFor(value);
            }
            return value;
        }
    },
    App: {
        type$: ["Control", "Origin", "Factory"],
        type$converter: "DataConverter",
        type$context: "AppContext",
        type$owner: "Owner",
        get$folder() {
            let name = this.conf.window.location.pathname;
            name = name.substring(name.lastIndexOf("/") + 1);
            name = name.substring(0, name.lastIndexOf("."));
            return "/file/" + name;
        },
        runScript(name) {
            import(name).then(v => {
                v.default.call(this);
            });
        },
        start(conf) {
            this.let("conf", conf);
            this.open(this.folder + "/app.json", "initializeApp");
            this.runScript(this.folder + "/index.mjs");
         },
        initializeOwner() {
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
            view(msg) {
                this.view.view(this.data);
                this.owner.send(this.view, "view");
            },
            initializeApp(msg) {
                let conf = msg.response 
                    ? this.create(this.conf, JSON.parse(msg.response)) 
                    : this.create();
                this.let("conf", conf);
                this.let("owner", this.create(conf.ownerType || this.owner));
                this.initializeOwner();

                if (conf.typeSource) {
                    this.open(conf.typeSource, "initializeContext");                 
                } else {
                    this.owner.send(this, "initializeContext");
                }
                this.open(conf.dataSource, "initializeData");
            },
            initializeContext(msg) {
                if (msg.response) {
                    let types = JSON.parse(msg.response);
                    this.types = this.create(types);
                } else {
                    this.types = this.create();
                }
                let ctx = this.create(this.context);
                ctx.start(this.types);
                //Create the view after the types have been initialized
                this.view = this.owner.create(this.conf.components.Object, this.types[this.conf.objectType]);
                this.view.file =  this.conf.dataSource;
                this.owner.append(this.view);
                if (this.data) this.receive("view");
            },
            initializeData(msg) {
                let data = JSON.parse(msg.response);
                data = this.converter.convert(data);
                console.debug(data);
                this.data = data; // this.create(data);
                if (this.view) this.receive("view");
            }
       }
    },
    AppContext: {
        type$: "Context",
        start(conf) {
            console.log(conf);
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
