class MessageBlob {
	constructor(_parent) {
		this.id = Date.now()
		this.parent = _parent;
		this.children = []
		this.messages = []
	}

	appendMessage(message) {
		this.messages.push(message)
	}
}