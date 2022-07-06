export default {
	expr: {
		type$: "record",
		expr: "text",
		note: {
			type$: "tree",
			p: {
				type$: "markup",
				b: "text",
				i: "text"
			}	
		},
		// content: {
		// 	type$: "list",
		// 	expr: "expr",
		// 	property: "property",
		// 	keyword: "keyword"
		// }
	},
	property: {
		type$: "expr",
		facets: "text",
		key: "text",
		type: "text",
	},
	keyword: {
		type$: "expr",
		keyword: "text",
	},
	properties: {
		type$: "list",
		property: "property"
	}
}