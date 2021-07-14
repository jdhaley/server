export default {
	type$: "/panel",
    type$tree: "/tree",
    type$tabs: "/tabs",
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
                    type$tabs: "tabs/Tabs",
                    type$tables: "Display"
                }
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
                    right: 4
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