function click_sendButton() {
	sendMessage($("#linearChatbox").val());
	$("#linearChatbox").val("");
	redrawLinearChat()
	redrawGraph();
}

$("#linearChatbox").keypress(function (e) {
	if(e.which === 13 && !e.shiftKey) {
		e.preventDefault();
	
		click_sendButton();
	}
});



function redrawLinearChat() {
	$(".linear-message-space").empty();
	last_author = ""
	MessageBlob.getAncestry(selectedMessageBlob).forEach(blob => {
		blob.messages.forEach(message => {
			var b = $($("#template-linear-message-bubble").html());
			$(".linear-message-space").append(b);
			b.find("p").text(message.text);
			if (message.author == last_author) {
				b.find(".linear-message-info-line > .author-label").hide()
				b.find(".linear-message-info-line > .time-label").hide()
			} else {
				b.find(".linear-message-info-line > .author-label").text(message.author);
				b.find(".linear-message-info-line > .time-label").text(new Date(parseInt(message.time)).toLocaleString());
			}
			last_author = message.author
		});
	});
}
