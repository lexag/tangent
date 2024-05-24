function click_sendButton() {
	sendMessage("some author", $("#linearChatbox").val());
	$("#linearChatbox").val("");
	redrawLinearChat()
}

$("#linearChatbox").keypress(function (e) {
	if(e.which === 13 && !e.shiftKey) {
		e.preventDefault();
	
		click_sendButton();
	}
});



function redrawLinearChat() {
	$(".linear-message-space").empty();
	selectedMessageBlob.getAncestry().forEach(blob => {
		blob.messages.forEach(message => {
			var b = $($("#template-linear-message-bubble").html());
			$(".linear-message-space").append(b);
			b.find("p").text(message.text);
			b.find(".linear-message-info-line > .author-label").text(message.author);
			b.find(".linear-message-info-line > .time-label").text(new Date(message.time).toLocaleString());
		});
	});
}
