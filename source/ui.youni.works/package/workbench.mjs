export default {
	type$: "/panel",
	Workbench: {
        type$: "Structure",
		direction: "horizontal",
		members: {
			context: {
                type$: "Display"
            },
			sidebar: {
                type$: "Structure",
                members: {
                    tree: {
                        type$: "Collection",
                        type$contentType: "Item"
                    },
                    value: {
                        type$: "Display",
                        nodeName: "pre",
                        extend$actions: {
                            showValue(event) {
                                this.peer.innerText = event.value;
                            }
                        }
                    }
                },
                extend$actions: {
                    showValue(event) {
                        this.owner.send(this.parts.value, event);
                    }
                }
            },
			main: {
                type$: "Structure",
                members: {
                    tabs: {
                        type$: "Display"
                    },
                }
            }
		}
    },
    ItemHeader: {
        type$: "Display",
        type$isUpperCase: "/base/util/Text/isUpperCase",
        facets: {
            folder: {
                icon: "/res/icons/folder-open.svg",
            },
            pkg: {
                icon: "/res/icons/archive.svg",
            },
            file: {
                icon: "/res/icons/file.svg",
            },
            interface: {
                icon: "/res/icons/gift.svg",
            },
            method: {
                icon: "/res/icons/settings.svg",
            },
            string: {
                icon: "/res/icons/tag.svg",
                title: true
            },
            object: {
                icon: "/res/icons/fullscreen.svg",
                title: true
            },
            type: {
                icon: "/res/icons/link.svg",
                title: true
            },
            get: {
                icon: "/res/icons/minus.svg",
                title: true
            },
            virtual: {
                icon: "/res/icons/plus.svg",
                title: true
            }
        },
        states: {
            "collapsed": "/res/icons/chevron-right.svg",
            "expanded": "/res/icons/chevron-bottom.svg",
            "empty": "/res/icons/empty.svg",
            "hidden": ""
        },
        virtual$state(value) {
            if (!arguments.length) return this.peer.$state;
            this.peer.$state = value;
            this.peer.firstChild.src = this.states[value];
        },
        view(model) {
            this.model = model;
            if (!model) {
                console.log(this.of.key);
            }
            let key = this.of.key;
            let type = model && model.facet || "";
            if (!type && this.isUpperCase(key.charAt(0))) type = "interface";
            if (!type) type = (model && typeof model.expr) || "undefined";
            let facet = this.facets[type];
            let ico = facet ? facet.icon : "/res/icons/flag.svg";
            let title = facet && facet.title ? type : "";
            if (model && model.expr && model.expr[""]) {
                title = model.expr[""].expr;
                if (typeof title != "string") {
                    let out = "";
                    for (let i in title) out += title[i].expr + " & ";
                    title = out.substring(0, out.length - 3);
                }
            }
            if (type == "type" && typeof model.expr == "string") title = model.expr;
            this.peer.innerHTML = `<img> <img src="${ico}" title="${type}"> ${key} <i>${title}</i>`;

            if (!key) {
                this.state = "hidden";
                this.of.style.display = "none";
            } else if (model && typeof model.expr == "object") {
                this.state = "collapsed";
            } else {
                this.state = "empty";
            }

        //    this.super(view, model);

        },
        extend$actions: {
            click(event) {
                event.value = this.model.expr;
                if (this.state === "collapsed") {
                    this.state = "expanded";
                } else if (this.state == "expanded") {
                    this.state = "collapsed";
                }
                event.subject = this.state;
            }
        }
    },
    ItemBody: {
        type$: "Collection",
        type$contentType: "Item",
        view(model) {
            if (this.peer.$show) {
                // let content = model;
                // if (content.expr && typeof content.expr == "object") content = model.expr;
                this.super(view, model.expr);
                this.owner.send(this, "view");
            } else {
                this.peer.$show = true;
            }
        }
    },
    Item: {
		type$: "Structure",
        members: {
            type$header: "ItemHeader",
            type$body: "ItemBody"
        },
		extend$actions: {
            empty(event) {
                event.subject = "showValue";
            },
			collapsed(event) {
                this.parts.body.style.display = "none";
                event.subject = "";
			},
			expanded(event) {
                if (!this.parts.body.peer.childNodes.length) {
                    this.parts.body.view(this.model);
                }
                this.parts.body.style.removeProperty("display");
                event.subject = "";
			}
		}
    }
}