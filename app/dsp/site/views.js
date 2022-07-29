//import {Table} from "./youni.works/ui/article.js";
export default {
	tasks: {
		type: "list",
		types: {
			task: "task"
		},
		conf: {
			title: "Tasks",
		}
	},
	task: {
		type: "form",
		types: {
			title: {
				type: "text",
				conf: {
					title: "Title"
				}
			},
			owner: {
				type: "text",
				conf: {
					title: "Owner",
				}		
			},
			type: {
				type: "text",
				conf: {
					title: "Type"
				}
			},
			due: {
				type: "text",
				conf: {
					title: "Due Date"
				}
			},
			status: {
				type: "text",
				conf: {
					title: "Status",
				}
			},
			tasks: {
				type: "table",
				types: {
					task: "taskRow"
				},
				conf: {
					rowType: "task",
					title: "Sub Tasks",
				}
			}
		},
		conf: {
			title: "•"
		}
	},
	taskRow: {
		type: "row",
		types: {
			title: {
				type: "text",
				conf: {
					title: "Title"
				}
			},
			owner: {
				type: "text",
				conf: {
					title: "Owner",
				}		
			},
			due: {
				type: "text",
				conf: {
					title: "Due Date"
				}
			},
			status: {
				type: "text",
				conf: {
					title: "Status",
				}
			}
		},
		conf: {
			title: ""
		}
	},
	unknown: "text",
	note: {
		type: "list",
		types: {
			p: "line",
			h: "line",
			line: "line", //required in binding the view.
			text: "line", //required for the model.
		},
		conf: {
			title: "Note"
		}
	},
	line: {
		type: "text",
		conf: {
			panel: false
		}
	}
}