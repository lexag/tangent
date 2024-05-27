const { contextBridge, ipcRenderer } = require('electron')

window.electronAPI = {
	// chat:*
	sendMessage: (text) => ipcRenderer.invoke('chat:sendMessage', text),
	branchAtMessage: (message_idx, blob_id) => ipcRenderer.invoke('chat:branchAtMessage', message_idx, blob_id),
	
	// appctx:*
	getappctx: () => ipcRenderer.invoke('appctx:get'),
	writeappctx: (path, value) => ipcRenderer.invoke('appctx:write', path, value),
}

