export default {
	type$: "/container",
	Workbench: {
        type$: "Structure",
		direction: "horizontal",
		members: {
			context: {
                type$: "Display"
            },
			sidebar: {
                type$: "Collection",
                type$contentType: "Section"
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
    }
}