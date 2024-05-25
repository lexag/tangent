const MessageBlob = require('../../common/class/messageBlob')
const Message = require('../../common/class/message')

var selectedMessageBlob = null;
var rootMessageBlob;
var tree;

function startup() {
	console.log("running startup")
	getTreeFromServer()
	.then(() => {
		selectedMessageBlob = tree.blobs[0]
		redrawLinearChat();
	})
}


async function getTreeFromServer() {
	await $.ajax({
		url: 'http://localhost:3000/',
		type: 'get',
		dataType: 'json',
		success: function (data) {
			tree = data
			rootMessageBlob = tree.blobs[0]
		}
	});
}


function sendMessage(author, text) {
	if (rootMessageBlob == null) {
		throw new Error('No root message blob found!')
		rootMessageBlob = new MessageBlob(null);
		selectedMessageBlob = rootMessageBlob;
	}

	var newMessage = new Message(author, text)
	MessageBlob.appendMessage(selectedMessageBlob, newMessage);


	$.ajax({
		url: 'http://localhost:3000/message',
		type: 'post',
		data: { 'message': newMessage, 'blob_id': selectedMessageBlob.id },
		dataType: 'json',
		success: function (data) {
			console.info(data);
		}
	});
}

getTreeFromServer()