function click_sendButton() {
	sendMessage("some author", $("#linearChatbox").text());
	$("#linearChatbox").text("");
	redrawLinearChat()
}


function redrawLinearChat() {
	
}