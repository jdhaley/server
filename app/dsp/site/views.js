export default {
	task: {
		type: "record",
		title: "",
		types: {
			title: {
				type: "text",
				title: "Title",
				panel: false
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
	note: {
		type: "list",
		title: "Note",
		types: {
			p: "line",
			h: "line",
			line: "line", //required in binding the view.
			text: "line", //required for the model.
		}
	},
	line: {
		type: "text",
		panel: false
	},
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
	}
}