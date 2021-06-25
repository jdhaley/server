export default {
	type$: "/container",
	type$Caption: "/cell/Caption",
	type$Property: "/cell/Property",
	type$Key: "/cell/Key",
	Value: {
		type$: "Record",
		type$elementType: "/cell/Property"
	},
	Columns: {
		type$: "Record",
		type$elementType: "/cell/Caption"
	},
	Sheet: {
		type$: "Record",
		elementType: {
			type$: "Structure",
			className: "part",
			members: {
				type$header: "Caption",
				type$body: "Property"
			}
		}
	},
	Section: {
		type$: "Structure",
		direction: "vertical",
		members: {
			type$header: "View",
			type$body: "Collection",
			type$footer: "View"
		}
	},
	Sheet2: {
		type$: "Section",
		members: {
			type$header: "Row",
			type$body: "Rows",
			type$footer: "Row"
		}
	},
	Row: {
		type$: "Structure",
		direction: "horizontal",
		members: {
			type$key: "Key",
			type$value: "Value"
		}
	},
	Rows: {
		type$: "Collection",
		type$elementType: "Row",
		direction: "vertical"
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