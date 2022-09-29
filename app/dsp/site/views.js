export default {
	task: {
		type: "record",
		title: "Task",
		types: {
			title: {
				type: "text",
				container: false,
				title: "Title",
			},
			owner: {
				type: "text",
				title: "Owner"
			},
			type: {
				type: "text",
				title: "Type"
			},
			status: {
				type: "text",
				title: "Status"
			},
			due: {
				type: "text",
				title: "Due Date"
			},
			desc: {
				type: "note",
				title: "Description"
			},
			tasks: {
				type: "list",
				title: "Sub Tasks",
				types: {
					task: "task"
				}
			}
		}
	},
	tasks: {
		type: "list",
		title: "Tasks",
		types: {
			task: "task"
		}
	},
	unknown: "text",
	person: {
		type: "record",
		title: "Person",
		types: {
			firstName: {
				type: "text",
				title: "Given Name",
			},
			lastName: {
				type: "text",
				title: "Surname",
			},
			email: {
				type: "text",
				title: "e-mail",
			},
			address: {
				type: "address",
				title: "Address"
			}
		}
	},
	address: {
		type: "record",
		title: "Address",
		types: {
			street: {
				type: "text",
				title: "Street"
			},
			city: {
				type: "text",
				title: "City"
			},
			code: {
				type: "text",
				title: "Postal Area Code"
			}
		}
	},
	note: {
		type: "markup",
		types: {
			para: {
				type: "line"
			},
			heading: {
				type: "line"
			},
			row: "row"
		}
	},
	row: "row",
	column: {
		type: "text",
		container: false,
		tagName: "ui-cell"
	}
}