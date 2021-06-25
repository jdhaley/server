export default {
	type$: "/container",
	type$Caption: "/cell/Caption",
	type$Value: "/cell/Value",
	type$Key: "/cell/Key",
	Sheet: {
		type$: "Record",
		elementType: {
			type$: "Composite",
			className: "part",
			members: {
				type$header: "Caption",
				type$body: "Value"
			}
		}
	},
	Section: {
		type$: "Composite",
		direction: "vertical",
		members: {
			type$header: "View",
			type$body: "Collection",
			type$footer: "View"
		}
	},
	Table: {
		type$: "Section",
		members: {
			type$header: "Row",
			type$body: "Rows",
			type$footer: "Row"
		}
	},
	Row: {
		type$: "Composite",
		direction: "horizontal",
		members: {
			type$key: "Key",
			type$value: "View"
		}
	},
	Rows: {
		type$: "Collection",
		elementType: "Row"
	},
	Grid: {
		type$: "Composite",
		members: {
			header: {
				type$: "Composite",
				members: {
					header: {
						type$: "Key",
					},
					body: {
						type$: "Composite",
						type$elementType: "Caption"
					}
				}
			},
			body: {
				type$: "Collection",
				elementType: {
					type$: "Composite",
					className: "object",
					members: {
						type$header: "Key",
						body: {
							type$: "Record",
							type$elementType: "Value"
						}
					}
				}
			},
			footer: {
				type$: "Composite",
				members: {
					header: {
						type$: "Key"
					},
					body: {
						type$: "Composite",
						elementType: {
							type$: "Caption",
							getCaption() {
								return "";
							}
						}
					}
				}
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