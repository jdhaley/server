export default {
	type$: "/container",
	type$Caption: "/cell/Caption",
	type$Value: "/cell/Value",
	type$Key: "/cell/Key",
	Sheet: {
		type$: "Object",
		elementType: {
			type$: "Composite",
			className: "part",
			members: {
				type$header: "Caption",
				type$body: "Value"
			}
		}
	},
	Grid: {
		type$: "Composite",
		members: {
			header: {
				type$: "Composite",
				members: {
					header: {
						type$: "View"
					},
					body: {
						type$: "Composite",
						type$elementType: "Caption"
					}
				}
			},
			body: {
				type$: "Collection",
				elementType: {
					type$: "Composite",
					className: "object",
					members: {
						type$header: "Key",
						body: {
							type$: "Record",
							type$elementType: "Value"
						}
					}
				}
			},
			footer: {
				type$: "Composite",
				members: {
					header: {
						type$: "View",
						className: "handle"
					},
					body: {
						type$: "Composite",
						elementType: {
							type$: "View",
							className: "caption"
						}
					}
				}
			}
		}
	}
}