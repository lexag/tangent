var selectedMessageBlob = null;
var rootMessageBlob;

function sendMessage(author, text) {
	if (rootMessageBlob == null) {
		rootMessageBlob = new MessageBlob(null);
	}
	selectedMessageBlob.appendMessage(new Message(author, text));
}