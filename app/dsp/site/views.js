export default {
	property: {
		type: "record",
		types: {
			facets: {
				type: "text",
				conf: {
					title: "Facets"
				}
			},
			key: {
				type: "text",
				conf: {
					title: "Name"
				}
			},
			type: {
				type: "text",
				conf: {
					title: "Type"
				}
			},
			expr: {
				type: "text",
				conf: {
					title: "Expression",
				}		
			},
			note: {
				type: "tree",
				types: {
					p: {
						type: "markup",
						types: {
							b: "text",
							i: "text"	
						}
					}
				},
				conf: {
					title: "Notes"
				}		
			}
		},
		conf: {
			title: "Property"
		}
	},
	properties: {
		type: "list",
		types: {
			property: "property"
		},
		conf: {
			title: "Properties",
		}
	}
}