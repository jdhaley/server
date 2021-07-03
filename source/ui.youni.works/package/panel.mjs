export default {
    type$: "/view",
    Panel: {
		type$: "Section",
		view(data) {
			this.parts.header.peer.textContent = "Header";
			this.parts.body.peer.textContent = "Body";
		}
	}
}