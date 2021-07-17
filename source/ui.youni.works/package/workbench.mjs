export default {
	type$: "/panel",
    type$tree: "/tree",
    type$Shape: "/shape/Shape",
	Workbench: {
        type$: "Section",
		direction: "horizontal",
		members: {
            type$header: "Display",
			type$body: "WorkbenchBody",
			type$footer: "WorkbenchFooter"
		}
    },
    WorkbenchFooter: {
        type$: "Display"
    },
	WorkbenchBody: {
        type$: "Structure",
		direction: "horizontal",
		members: {
			type$context: "Display",
			type$sidebar: "Sidebar",
            main: {
                type$: "Structure",
                members: {
                    type$tabs: "Tabs",
                    type$tables: "Display"
                }
            }
		}
    },
    Tabs: {
        type$: "Section",
        conf: {
            type$tab: "Tab"
        },
        var$activeTab: null,
        members: {
            header: {
                type$: "Collection"
            },
            body: {
                type$: "Display"
            }
        },
        add(title, body) {
            let tab = this.owner.create(this.conf.tab);
            tab.peer.innerText = title;
            this.parts.header.append(tab);
            if (!this.activeTab) this.activeTab = tab;
            return tab;
        },
        display() {
            this.super(display);
            this.add("Tree");
            this.add("Other");
            this.add("Other");
            this.add("Other");
            this.add("Other");
            this.add("Other");
            this.add("Other");
            this.add("Other");
        },
        extend$actions: {
            showTab(event) {
                this.activeTab.style.removeProperty("background");
                this.activeTab.style.removeProperty("color");
                this.activeTab = event.tab;
                this.activeTab.style.background = "white";
                this.activeTab.style.color = "darkslategray"
            }
        }
    },
    Tab: {
        type$: "Display",
        extend$actions: {
            click(event) {
                event.subject = "showTab";
                event.tab = this;
            }
        }
    },
    Sidebar: {
        type$: ["Structure", "Shape"],
        members: {
            tree: {
                type$: "Collection",
                type$contentType: "tree/Item"
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
}