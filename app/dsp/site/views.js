export default {
	task: {
		type: "record",
		title: "Task",
		types: {
			title: {
				type: "text",
				title: "Title"
			},
			owner: {
				type: "text",
				title: "Owner"
			},
			type: {
				type: "text",
				title: "Type"
			},
			due: {
				type: "text",
				title: "Due Date"
			},
			status: {
				type: "text",
				title: "Status"
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
	}
}