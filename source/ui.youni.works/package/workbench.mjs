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
                type$contentType: "Directory"
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
    Directory: {
        type$: "Section",
        view(model) {
            this.super(view, model);
            this.parts.header.peer.textContent = this.key;
        },
        size(x, y) {
			// for (let part of this.to) {
			// 	if (part != this.parts.body) y -= part.bounds.height;
			// }
			// this.style.minWidth = x + "px";
            // this.style.maxWidth = x + "px";
			// this.parts.body.style.minHeight = y + "px";
			// this.parts.body.style.maxHeight = y + "px";
		},
		extend$actions: {
			collapse(event) {
				if (this.collapsed === "false") {
					this.parts.body.style.display = "none";
					this.parts.body.style.maxHeight = "0";
					this.collapsed = "true";
				}
			},
			expand(event) {
				if (this.collapsed === "true") {
					this.parts.body.style.removeProperty("display");
					this.collapsed = "false";
				}
			},
			click(event) {
				if (event.target == this.parts.header.peer) {
					this.receive(this.collapsed === "true" ? "expand" : "collapse");
				}
			}
		}
    }
}