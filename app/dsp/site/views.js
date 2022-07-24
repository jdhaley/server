//import list from "./controller/list.js";
export default {
	// protected getRange(): Range {
	// 	let view = this.owner.frame.getElementById(this.viewId) as ViewElement;
	// 	if (!view) throw new Error(`Can't find view element ${this.viewId}`);
	
	// 	let range = this.owner.frame.createRange();
	// 	range.selectNodeContents(view.v_content);
	// 	return range;
	// }
	
	// export class Item {
	// 	id: string;
	// 	type: string;
	// 	title: string;
	// 	//path: string; - virtual or physical path
	// 	/** The Party owning the item.  Geneally a group or individual user */
	// 	owner: Party;
	// 	status: string
	// }
	
	// /** All items have the following statuses. Subtypes can have additional ones. */
	// type ItemStatus = "inactive" | "active" | "review" | "cancelled";
	
	// export class Task extends Item {
	// 	declare status: ItemStatus | "completed";
	// 	due: Date;
	// 	priority: "low" | "medium" | "high";
	// 	assignedTo: Party;
	// 	artifact?: Artifact
	// 	comments?: Comment[];
	// 	subtasks?: Task[];
	// };
	task: {
		type: "record",
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
				type: "list",
				types: {
					task: "task"
				},
				conf: {
					title: "Sub Tasks",
				}
			}
		},
		conf: {
			title: "•"
		}
	},
	tasks: {
		type: "list",
		types: {
			task: "task"
		},
		conf: {
			title: "Tasks",
		}
	},
	unknown: "text"
}