export default {
	type$: "/container",
	type$Caption: "/cell/Caption",
	type$Property: "/cell/Property",
	type$Key: "/cell/Key",
	Section: {
		type$: "Structure",
		direction: "vertical",
		members: {
			type$header: "View",
			type$body: "View",
			type$footer: "View"
		}
	},
	Row: {
		type$: "Structure",
		direction: "horizontal",
		members: {
			type$key: "Key",
			type$value: "View"
		}
	},
	Value: {
		type$: "Record",
		type$elementType: "/cell/Property"
	},
	Sheet: {
		type$: "Section",
		members: {
			type$header: "View",
			type$body: "Rows",
			type$footer: "View"
		}
	},
	Rows: {
		type$: "Collection",
		type$elementType: "Row",
		direction: "vertical"
	},
	PropertySheet: {
		type$: "Sheet",
		members: {
			body: {
				type$: "Record",
				elementType: {
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
						type$elementType: "Caption"
					}
				}
			},
			body: {
				type$: "Rows",
				elementType: {
					type$: "Row",
					members: {
						type$key: "Key",
						value: {
							type$: "Record",
							type$elementType: "Property"
						}
					}
				}
			},
			footer: {
				type$: "Rows",
				type$elementType: "View"
				// members: {
				// 	type$key: "Key",
				// 	value: {
				// 		type$: "Record",
				// 		elementType: {
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