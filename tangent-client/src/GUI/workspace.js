function click_connectionSettingsButton() {
	var modal = document.querySelector("#connection-settings")
	modal.showModal()
	window.electronAPI.getappctx().then(ctx => {
		$("#connection-server-address").val(ctx.user.serverURL);
		$("#connection-username").text(ctx.user.userName);
	})
}

function click_applyConnectionSettings() {
	window.electronAPI.getappctx().then(ctx => {
		var serverURL = $("#connection-server-address").val();
		var username = $("#connection-username").val();
		document.querySelector("#connection-settings").close()
		window.electronAPI.writeappctx("user.serverURL", serverURL)
		window.electronAPI.writeappctx("user.username", username)
	})
}