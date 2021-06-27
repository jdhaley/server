export default {
	type$: "/container",
	Workbench: {
        type$: "Structure",
		direction: "horizontal",
		members: {
			context: {
                type$: "View"
            },
			sidebar: {
                type$: "Collection",
                type$contentType: "Section"
            },
			main: {
                type$: "Structure",
                members: {
                    tabs: {
                        type$: "View"
                    },

                }
            }
		}       
    }
}