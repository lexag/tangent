const MessageBlob = require('../../common/class/messageBlob')
const Message = require('../../common/class/message')

const storage = require('electron-json-storage');

var selectedMessageBlob = null;
var rootMessageBlob;
var tree;

var serverURL = "http://localhost:3000"
var userName = "Anonymous User"

function startup() {
	getTreeFromServer(serverURL)
		.then(tree => {
			selectedMessageBlob = tree.blobs[0]
			rootMessageBlob = tree.blobs[0]
			redrawLinearChat();
		})
}


function saveSettingsToStorage() {
	storage.set(
		'user', {
		'username': userName,
		'serverURL': serverURL
	}).then(x => console.log("saved"))
}

async function getTreeFromServer(url) {
	await $.ajax({
		url: url,
		type: 'get',
		dataType: 'json',
		success: data => {
			return data
		}
	})
	.catch(e => {
		console.error(e);
	});
}


function sendMessage(text, author = userName) {
	saveSettingsToStorage();
	if (rootMessageBlob == null) {
		throw new Error('No root message blob found!')
		rootMessageBlob = new MessageBlob(null);
		selectedMessageBlob = rootMessageBlob;
	}

	var newMessage = new Message(author, text)
	MessageBlob.appendMessage(selectedMessageBlob, newMessage);


	$.ajax({
		url: serverURL + '/message',
		type: 'post',
		data: { 'message': newMessage, 'blob_id': selectedMessageBlob.id },
		dataType: 'json',
		success: function (data) {
			console.info(data);
		}
	});
}

