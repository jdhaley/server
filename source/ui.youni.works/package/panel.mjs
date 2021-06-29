export default {
    type$: "/cell",
    Panel: {
		type$: "Section",
		bind(data) {
			this.parts.header.peer.textContent = "Header";
			this.parts.body.peer.textContent = "Body";
		}
	}
}