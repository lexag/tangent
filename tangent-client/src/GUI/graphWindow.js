
function redrawGraph(ctx) {
	var nodes = []
	for (const [id, blob] of Object.entries(ctx.globalTree.blobs)) {
		nodes.push(
			{
				name: blob.name ?? "",
				id: id,
				parent: blob.parent_id,
				color: (id == ctx.selectedMessageBlob.id) ? '#034efc' : '#121212',
				label_color: (id == ctx.selectedMessageBlob.id) ? '#dcdfe6' : '#034efc',
				attributes: {
					len: blob.messages.length, 
					firstmessage: (blob.messages.length == 0) ? "no messages" : blob.messages[0]?.text.slice(0, 24),
					lastmessage: (blob.messages.length == 0) ? "" : blob.messages[blob.messages.length - 1]?.text.slice(0, 24)
				},
				events: {
					click: function (e) {
						ctx.selectedMessageBlob = ctx.globalTree.blobs[this.id]
						redrawLinearChat(ctx.globalTree, selectedMessageBlob);
						redrawGraph(ctx.globalTree);
					}
				}
			}
		)
	}
	var chart = JSC.chart('tree-graph', {
		debug: true,
		type: 'organizational down',
		legend_visible: false,
		chartArea: {
			fill: ['#121212', '#121212', -90],
		},
		height: "1000px",
		series: [
			{
				defaultPoint: {
					label: {
						text: '<b>%name</b><br/>%firstmessage<br/>...<br/>%lastmessage',
						autoWrap: false
					},
					connectorLine_color: "#034efc",
					annotation: {
						padding: 9,
						corners: ['round', 'round', 'round', 'round'],
						margin: [15, 5, 10, 0]
					},
					outline: { color: '#034efc', width: 2 },
					color: '#121212',
					tooltip: '%len messages'
				},
				points: nodes
			}
		]
	});
}