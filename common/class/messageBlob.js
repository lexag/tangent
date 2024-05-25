class MessageBlob {
	constructor(_parent) {
		this.id = Date.now()
		this.parent = _parent;
		this.messages = []
	}

	static appendMessage(messageBlob, message) {
		messageBlob.messages.push(message)
	}

	static getAncestry(messageBlob) {
		var ancestry = []
		var m = messageBlob;
		do {
			ancestry.push(m)
			m = m.parent
		} while(m != null)
		ancestry.reverse()
		return ancestry;
	}
}

module.exports = MessageBlob