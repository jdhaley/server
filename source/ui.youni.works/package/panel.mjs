export default {
    type$: "/cell",
    Panel: {
		type$: "Section",
		observe(data) {
			this.parts.header.peer.textContent = "Header";
			this.parts.body.peer.textContent = "Body";
		}
	}
}