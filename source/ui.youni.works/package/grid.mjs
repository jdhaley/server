export default {
	type$: "/container",
	type$Caption: "/property/Caption",
	type$Cell: "/property/Cell",
	type$Key: "/property/Key",
	Sheet: {
		type$: "Object",
		elementType: {
			type$: "Composite",
			className: "part",
			members: {
				type$header: "Caption",
				type$body: "Cell"
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
							type$elementType: "Cell"
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