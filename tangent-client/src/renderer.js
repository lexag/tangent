const { ipcRenderer } = require('electron')

setInterval(requestGUIRedraw, 1000)

async function requestGUIRedraw() {
	await window.electronAPI.getappctx()
	.then(appctx => {
		redrawGraph(appctx)
		redrawLinearChat(appctx)
	})
}