const server = require('server');
const { get, post, error } = server.router;
const { render, json, status } = server.reply;

const jsonfile = require('jsonfile')

const BlobTree = require('../common/class/blobTree.js');
const MessageBlob = require('../common/class/messageBlob.js');

function initTree() {
	let newTree = new BlobTree({0: new MessageBlob(null)})
	jsonfile.writeFile('/tangent/server/data/tree.json', newTree)
	console.log("initialized new tree")
}

function saveTree(t) {
	jsonfile.writeFile('/tangent/server/data/tree.json', t)
}

// create tree and load tree content
var tree = new BlobTree([]);
jsonfile.readFile('/tangent/server/data/tree.json')
	.then(obj => { tree = obj; console.log("loaded tree from file"); })
	.catch(error => console.error(error))


// Handle requests to the url "/" ( http://localhost:3000/ )
server({ security: { csrf: false } },
	[
		get('/', ctx => json(tree)),
		post('/message', ctx => {
			BlobTree.addMessageToBlob(tree, ctx.data.blob_id, ctx.data.message)
			saveTree(tree)
			return status(201)
		}),
		post('/branch', ctx => {
			var newBlob = BlobTree.splitBlobAtMessageIndex(tree, ctx.data.blob_id, ctx.data.message_index)
			saveTree(tree)
			return status(201).send({"tree": tree, "new_id": newBlob.id})
		}),
		error(ctx => { console.error('error 500: ' + ctx.error.message); return status(500).send(ctx.error.message); }),
	]);
