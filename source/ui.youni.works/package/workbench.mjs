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
        display() {
            this.super(display);
            this.peer.innerHTML = "<img src='/res/icons/chevron-bottom.svg'> " + this.of.key;
        },
        view(model) {
            this.super(view, model);
            if (typeof model == "object" && Object.keys(model).length) {
                this.state = "expanded";
            } else {
                this.state = "empty";
            }
        },
        virtual$state(value) {
            if (!arguments.length) return this.peer.$state;
            this.peer.$state = value;
            this.peer.firstChild.src = this.states[value];
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
    Folder: {
        type$: "Section",
        members: {
            header: {
                type$: "FolderHeader"
            },
            body: {
                type$: "Collection",
                type$contentType: "Folder"
            }
        },
		extend$actions: {
			collapsed(event) {
                this.parts.body.style.display = "none";
                event.subject = "";
			},
			expanded(event) {
                this.parts.body.style.removeProperty("display");
                event.subject = "";
			}
		}
    }
}