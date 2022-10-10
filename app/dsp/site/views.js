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
			worktask: "worktask"
		}
	},
	row: "row",
	cell: {
		type: "text",
		container: false,
		tagName: "ui-cell"
	},
	//Task model: Category: Title/Short Description: Due Date Time: : Status: Priority (optional): Assigned To (optional)
	worktask: {
		type: "row",
		title: "Task",
		tableTitle: "Tasks",
		types: {
			category: {
				type: "cell",
				title: "Category"
			},
			title: {
				type: "cell",
				title: "Title",
			},
			due: {
				type: "cell",
				title: "Due"
			},
			status: {
				type: "cell",
				title: "Status"
			},
			priority: {
				type: "cell",
				title: "Priority"
			},
			owner: {
				type: "cell",
				title: "Owner"
			}
		}
	},
	//Work log model: Start Date Time to End Date Time: Category: Title/Short Description
	worklog: {
		type: "row",
		title: "Log",
		types: {
			startDate: {
				type: "text",
				title: "From"
			},
			endDate: {
				type: "text",
				title: "From"
			},
			category: {
				type: "text",
				title: "Category"
			},
			title: {
				type: "text",
				title: "Title",
			}	
		}
	}
}