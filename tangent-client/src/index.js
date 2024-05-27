const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const settings = require('electron-settings')
const MessageBlob = require("../../common/class/messageBlob");
const Message = require('../../common/class/message')



const appctx = {
	user: {
		serverURL: "http://localhost:300",
		username: "Anonymous User",
	}
}



// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit();
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 800 * 2,
		height: 600 * 2,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile(path.join(__dirname, 'index.html'));

	// Open the DevTools.
	mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	ipcMain.handle('chat:sendMessage', sendMessage)
	ipcMain.handle('chat:branchAtMessage', branchAtMessage)
	ipcMain.handle('appctx:get', getappctx)
	ipcMain.handle('appctx:write', writeappctx)

	createWindow();

	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('browser-window-created', () => {
	startup();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

function getappctx(event) {
	console.log(appctx)
	return appctx;
}

function writeappctx(event, keyPath, value) {
	const keys = keyPath.split('.');
	const targetKey = keys.pop();
	let current = appctx;
	for (let i = 0; i < keys.length; ++i) {
		current = current[keys[i]];
		if (!current) {
			throw new Error('Specified key not found. ' + keys[i]);
		}
	}
	current[targetKey] = value;
	saveSettingsToStorage();
}




function startup() {
	appctx.user = {
		serverURL: "http://127.0.0.1:3000",
		username: "Anonymous User",
	}

	appctx.selectedMessageBlob = null;
	appctx.globalTree;

	getTreeFromServer(appctx.user.serverURL)
		.then(tree => {
			appctx.globalTree = tree
			appctx.selectedMessageBlob = tree.blobs[0]
		})
		.catch(error => { console.error(error) })

	if (settings.hasSync('user')) {
		settings.get('user')
			.then(user => {
				appctx.user = user
			})
	}
	else {
		saveSettingsToStorage()
	}
}


function saveSettingsToStorage() {
	settings.set('user', appctx.user).then(x => console.log("saved"))
}

async function getTreeFromServer(url) {
	const response = await fetch(url, {
		method: 'GET',
		mode: 'cors',
	})
		.catch(error => { console.error(error) })
	return response.json()
}


async function sendMessage(event, text) {
	console.log("sendMessage text:", text)
	if (appctx.globalTree.blobs.length == 0) {
		throw new Error('No root message blob found!')
	}

	var newMessage = new Message(appctx.user.username, text)
	MessageBlob.appendMessage(appctx.selectedMessageBlob, newMessage);

	var success = true
	await fetch(appctx.user.serverURL + '/message', {
		method: 'POST',
		body: JSON.stringify({ 'message': newMessage, 'blob_id': appctx.selectedMessageBlob.id },)
	})
		.catch(error => { console.error(error); success = false })

	return [success, appctx]
}


async function branchAtMessage(event, message_idx, blob_id) {
	await fetch(appctx.user.serverURL + '/branch', {
		mode: 'POST',
		body: JSON.stringify({ 'message_index': message_idx, 'blob_id': blob_id }),
	})
		.then(response => {
			data = response.json()

			appctx.globalTree = data.tree
			var frontBlob = appctx.globalTree.blobs[data.new_id]
			appctx.selectedMessageBlob = frontBlob
		})
		.catch(error => { console.error(error) })
}


function setConnectionSettings(event, serverURL, username) {
	appctx.user.serverURL = serverURL
	appctx.user.username = username
}