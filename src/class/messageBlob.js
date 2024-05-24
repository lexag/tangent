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

	getAncestry() {
		var ancestry = []
		var m = this;
		do {
			ancestry.push(m)
			m = m.parent
		} while(m != null)
		ancestry.reverse()
		return ancestry;
	}
}