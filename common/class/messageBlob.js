class MessageBlob {
	constructor(_parent_id, id_offset) {
		this.id = (_parent_id == null) ? 0 : Date.now() + id_offset
		this.parent_id = _parent_id;
		this.messages = []
	}

	static appendMessage(messageBlob, message) {
		messageBlob.messages.push(message)
	}

	static getAncestry(tree, messageBlob) {
		var ancestry = []
		var m = messageBlob;
		while (m != null) {
			ancestry.push(m)
			m = tree.blobs[m.parent_id]
		}
		ancestry.reverse()
		return ancestry;
	}
}

module.exports = MessageBlob