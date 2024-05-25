const Message = require("./message")
const MessageBlob = require("./messageBlob")

class BlobTree {
	constructor(blobs) {
		this.blobs = blobs
	}

	static addMessageToBlob(tree, id, message) {
		tree.blobs.forEach(element => {
			if(element.id == id) {
				MessageBlob.appendMessage(element, message)
			}
		});
	}
}

module.exports = BlobTree