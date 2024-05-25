const Message = require("./message")
const MessageBlob = require("./messageBlob")

class BlobTree {
	constructor(blobs) {
		this.blobs = blobs
	}

	static addMessageToBlob(tree, id, message) {
		MessageBlob.appendMessage(tree.blobs[id], message)
	}

	static splitBlobAtMessageIndex(tree, id, idx) {
		idx = parseInt(idx)
		
		// create later half of old blob
		var oldBlob = tree.blobs[id]
		var newBlob = new MessageBlob(id, 0)
		tree.blobs[newBlob.id] = newBlob;
		
		// transfer messages
		var m_idx = idx + 1
		while (m_idx < oldBlob.messages.length) {
			BlobTree.addMessageToBlob(tree, newBlob.id, oldBlob.messages[m_idx])
			m_idx++;
		}
		oldBlob.messages.length = idx + 1;

		// transfer children
		for (const [id, blob] of Object.entries(tree.blobs)) {
			if (blob.parent_id == oldBlob.id && blob.id != newBlob.id) {
				blob.parent_id = newBlob.id;
			}
		}

		// create branched blob
		var branchBlob = new MessageBlob(id, 1)
		tree.blobs[branchBlob.id] = branchBlob
		console.dir([oldBlob, newBlob, branchBlob])
		
		return branchBlob;
	}
}

module.exports = BlobTree