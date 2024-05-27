const MessageBlob = require("../../common/class/messageBlob");
const Message = require('../../common/class/message')

const storage = require('electron-json-storage');

window.selectedMessageBlob = null;
window.globalTree;

var serverURL = "http://localhost:3000"
var userName = "Anonymous User"

function startup() {
	getTreeFromServer(serverURL)
		.then(tree => {
			window.globalTree = tree
			window.selectedMessageBlob = tree.blobs[0]
			redrawLinearChat(tree, selectedMessageBlob);
			redrawGraph(tree);
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
	let dat = null
	await $.ajax({
		url: url,
		type: 'get',
		dataType: 'json',
		success: data => {
			dat = data
		}
	})
	.catch(e => {
		console.error(e);
	});
	return dat;
}


function sendMessage(text, author = userName) {
	if (window.globalTree.blobs.length == 0) {
		throw new Error('No root message blob found!')
	}

	var newMessage = new Message(author, text)
	MessageBlob.appendMessage(window.selectedMessageBlob, newMessage);


	$.ajax({
		url: serverURL + '/message',
		type: 'post',
		data: { 'message': newMessage, 'blob_id': window.selectedMessageBlob.id },
		dataType: 'json',
		success: function (data) {
			console.info(data);
		}
	});

	redrawLinearChat(window.globalTree, window.selectedMessageBlob)
	redrawGraph(window.globalTree);
}


function branchAtMessage(idx, blob_id) {
	$.ajax({
		url: serverURL + '/branch',
		type: 'post',
		data: { 'message_index': idx, 'blob_id': blob_id },
		dataType: 'json',
		success: function (data) {
			console.dir(data)
			window.globalTree = data.tree
			var frontBlob = window.globalTree.blobs[data.new_id]
			window.selectedMessageBlob = frontBlob
			redrawGraph(window.globalTree)
			redrawLinearChat(window.globalTree, frontBlob)
		}
	});
}