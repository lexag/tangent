function click_connectionSettingsButton() {
	var modal = document.querySelector("#connection-settings")
	modal.showModal()
	$("#connection-server-address").val(serverURL);
	$("#connection-username").text(userName);
	
	// var b = $($("#template-connection-details").html());
	// $(".workspace").before(b);
}

function click_applyConnectionSettings() {
	serverURL = $("#connection-server-address").val();
	userName = $("#connection-username").val();
	document.querySelector("#connection-settings").close()

	// $("#connection-settings").remove();
}