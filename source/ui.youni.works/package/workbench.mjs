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
            folder: "/res/icons/folder-open.svg",
            pkg: "/res/icons/gift.svg",
            file: "/res/icons/file.svg",
            method: "/res/icons/settings.svg",
            string: "/res/icons/tag.svg",
            object: "/res/icons/fullscreen.svg",
            type: "/res/icons/link.svg",
            get: "/res/icons/minus.svg",
            virtual: "/res/icons/plus.svg"
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
            let facet = model && model.facet || "";
            if (!facet) facet = (model && typeof model.expr) || "undefined";
            let ico = this.facets[facet] || "/res/icons/flag.svg";
            let type = model && typeof model.expr || "";
            if (facet || type == "object") type = "";

            this.peer.innerHTML = `<img> <img src="${ico}" title="${facet}"> ${this.of.key} <i>${facet}</i> <u>${type}</u>`;

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