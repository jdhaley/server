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
        states: {
            "collapsed": "/res/icons/chevron-right.svg",
            "expanded": "/res/icons/chevron-bottom.svg",
            "empty": "/res/icons/bag.svg"
        },
        virtual$state(value) {
            if (!arguments.length) return this.peer.$state;
            this.peer.$state = value;
            this.peer.firstChild.src = this.states[value];
        },
        display() {
            this.super(display);
            this.peer.innerHTML = "<img src='/res/icons/chevron-right.svg'> " + this.of.key;
        },
        view(model) {
            this.super(view, model);
            if (model && typeof model == "object" && Object.keys(model).length) {
                this.state = "collapsed";
            } else {
                this.state = "empty";
            }
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
                this.super(view, model);
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