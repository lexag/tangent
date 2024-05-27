function click_connectionSettingsButton() {
	var modal = document.querySelector("#connection-settings")
	modal.showModal()
	$("#connection-server-address").val(window.user.serverURL);
	$("#connection-username").text(window.user.userName);
}

function click_applyConnectionSettings() {
	window.user.serverURL = $("#connection-server-address").val();
	window.user.userName = $("#connection-username").val();
	document.querySelector("#connection-settings").close()
}