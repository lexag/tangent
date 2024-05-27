const { contextBridge, ipcRenderer } = require('electron')

window.electronAPI = {
	sendMessage: (text) => ipcRenderer.invoke('chat:sendMessage'),
	branchAtMessage: (message_idx, blob_id) => ipcRenderer.invoke('chat:branchAtMessage'),
	getappctx: () => ipcRenderer.invoke('get:appctx'),
}

