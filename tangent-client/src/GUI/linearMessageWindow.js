const $ = require('jquery')

async function click_sendButton() {
	var text = $("#linearChatbox").val()
	console.log(text)
	await window.electronAPI.sendMessage(text)
	.then((success, appctx) => {
		if (success) {
			$("#linearChatbox").val("");
			redrawLinearChat(appctx.globalTree, appctx.selectedMessageBlob)
			redrawGraph(appctx.globalTree)
		}
	})
}

$("#linearChatbox").keypress(function (e) {
	if(e.which === 13 && !e.shiftKey) {
		e.preventDefault();
		click_sendButton();
	}
});



function redrawLinearChat(ctx) {
	$(".linear-message-space").empty();
	last_author = ""
	var ancestry = []
	var m = ctx.selectedMessageBlob;
	while (m != null) {
		ancestry.push(m)
		m = ctx.globalTree.blobs[m.parent_id]
	}
	ancestry.reverse()
	
	ancestry.forEach(blob => {
		var n = 0;
		$(".linear-message-space").append($('<div class="delimiter horizontal"></div>'))
		blob.messages.forEach(message => {
			var b = $($("#template-linear-message-bubble").html());
			$(".linear-message-space").append(b);
			b.find("p").text(message.text);
			b.find(".branch-button").attr('message_index', n)
			b.find(".branch-button").attr('blob_id', blob.id)
			if (message.author == last_author & n != 0) {
				b.find(".linear-message-info-line > .author-label").hide()
				b.find(".linear-message-info-line > .time-label").hide()
			} else {
				b.find(".linear-message-info-line > .author-label").text(message.author);
				b.find(".linear-message-info-line > .time-label").text(new Date(parseInt(message.time)).toLocaleString());
			}
			last_author = message.author
			n++;
		});
	});
}


function click_branchButton(message_element) {
	var idx = message_element.getAttribute('message_index')
	var id = message_element.getAttribute('blob_id')
	window.electronAPI.branchAtMessage(idx, id)
}