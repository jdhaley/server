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
                type$: "Collection",
                type$contentType: "Folder"
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
    FolderHeader: {
        type$: "Display",
        facets: {
            folder: {
                icon: "/res/icons/folder-open.svg",
            },
            pkg: {
                icon: "/res/icons/gift.svg",
            },
            file: {
                icon: "/res/icons/file.svg",
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
            "empty": "/res/icons/empty.svg"
        },
        virtual$state(value) {
            if (!arguments.length) return this.peer.$state;
            this.peer.$state = value;
            this.peer.firstChild.src = this.states[value];
        },
        view(model) {
            if (!model) {
                console.log(this.of.key);
            }
            let type = model && model.facet || "";
            if (!type) type = (model && typeof model.expr) || "undefined";
            let facet = this.facets[type];
            let ico = facet ? facet.icon : "/res/icons/flag.svg";
            let title = facet && facet.title ? type : "";
            this.peer.innerHTML = `<img> <img src="${ico}" title="${type}"> ${this.of.key} <i>${title}</i>`;

            if (model && typeof model.expr == "object") {
                this.state = "collapsed";
            } else {
                this.state = "empty";
            }

        //    this.super(view, model);

        },
        extend$actions: {
            click(event) {
                if (this.state === "collapsed") {
                    this.state = "expanded";
                } else if (this.state == "expanded") {
                    this.state = "collapsed";
                } else {
                }
                event.subject = this.state;
            }
        }
    },
    FolderBody: {
        type$: "Collection",
        type$contentType: "Folder",
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
    Folder: {
		type$: "Structure",
        members: {
            type$header: "FolderHeader",
            type$body: "FolderBody"
        },
		extend$actions: {
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