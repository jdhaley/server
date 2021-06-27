export default {
	type$: "/container",
	type$Caption: "/cell/Caption",
	type$Property: "/cell/Property",
	type$Key: "/cell/Key",
	Row: {
		type$: "Structure",
		direction: "horizontal",
		members: {
			type$key: "Key",
			type$value: "Display"
		}
	},
	Value: {
		type$: "Record",
		type$contentType: "/cell/Property"
	},
	Sheet: {
		type$: "Section",
		members: {
			type$header: "Display",
			type$body: "Rows",
			type$footer: "Display"
		}
	},
	Rows: {
		type$: "Collection",
		type$contentType: "Row",
		direction: "vertical"
	},
	PropertySheet: {
		type$: "Sheet",
		members: {
			body: {
				type$: "Record",
				contentType: {
					type$: "Row",
					members: {
						type$key: "Caption",
						type$value: "Property"
					}
				}
			}
		}
	},
	Table: {
		type$: "Section",
		members: {
			header: {
				type$: "Row",
				members: {
					type$key: "Key",
					value: {
						type$: "Record",
						type$contentType: "Caption"
					}
				}
			},
			body: {
				type$: "Rows",
				contentType: {
					type$: "Row",
					members: {
						type$key: "Key",
						value: {
							type$: "Record",
							type$contentType: "Property"
						}
					}
				}
			},
			footer: {
				type$: "Rows",
				type$contentType: "Display"
				// members: {
				// 	type$key: "Key",
				// 	value: {
				// 		type$: "Record",
				// 		contentType: {
				// 			type$: "Caption",
				// 			getCaption() {
				// 				return "";
				// 			}
				// 		}
				// 	}
				// }
			}
		},
		get$id() {
			return this.peer.id;
		},
		start(conf) {
			this.super(start, conf);
			this.peer.id = "I" + this.owner.createId();
		},
	}
}