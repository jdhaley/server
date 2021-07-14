export default {
	type$: "/panel",
    type$Shape: "/shape/Shape",
	Workbench: {
        type$: "Structure",
		direction: "horizontal",
		members: {
			context: {
                type$: "Display"
            },
			sidebar: {
                type$: ["Structure", "Shape"],
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
                extend$conf: {
                    zone: {
                        border: {
                            right: 6
                        },
                        cursor: {
                            "TR": "ew-resize",
                            "CR": "ew-resize",
                            "BR": "ew-resize",
                        },
                        subject: {
                            "TR": "size",
                            "CR": "size",
                            "BR": "size",
                        }
                    },	
                },        
                extend$actions: {
                    showValue(event) {
                        this.owner.send(this.parts.value, event);
                    },
                    size(event) {
                        if (event.track == this) {
                            let r = this.bounds;
                            this.bounds = {
                                width: event.clientX - r.left
                            }
                        }
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
            type: {
                icon: "/res/icons/link.svg",
            },

            get: {
                icon: "/res/icons/minus.svg",
                title: true
            },
            virtual: {
                icon: "/res/icons/plus.svg",
                title: true
            },
    
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
            this.super(view, model);
            if (!model) {
                console.log(this.of.key);
            }
            let facet = this.facets[model.facet];
            let icon = facet ? facet.icon : "/res/icons/fullscreen.svg";
            let type = model.type;
            let value = "";
            switch (type) {
                case "function":
                case "object":
                    type = "";
                    break;
                case "number":
                    type = "";
                    value = model.expr;
                    icon = "/res/icons/fullscreen-exit.svg";
                    break;
                case "string":
                    type = "";
                    value = model.expr;
                    icon = "/res/icons/tag.svg";
                    break;
                case "boolean":
                    type = "";
                    value = model.expr ? true : false;
                    icon = "/res/icons/flag.svg";
                    break;
            }
            this.peer.innerHTML = `<img> <img src="${icon}" title="${model.facet}"> ${model.name} <i>${type}</i> <span>${value}</span>`;

            if (typeof model.expr == "object") {
                this.state = "collapsed";
            } else {
                this.state = "empty";
            }
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
        view(model) {
            if (!model) throw new Error();
            this.super(view, model);
            // let facet = this.facets[type];
            // let ico = facet ? facet.icon : "/res/icons/flag.svg";
            // let title = facet && facet.title ? type : "";

            // this.peer.innerHTML = `<img> <img src="${ico}" title="${type}"> ${key} <i>${title}</i>`;

            // if (!key) {
            //     this.state = "hidden";
            //     this.of.style.display = "none";
            // } else if (model && typeof model.expr == "object") {
            //     this.state = "collapsed";
            // } else {
            //     this.state = "empty";
            // }
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