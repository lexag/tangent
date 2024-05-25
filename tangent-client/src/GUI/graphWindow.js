
function redrawGraph(tree) {
	var nodes = []
	console.log(tree)
	for (const [id, blob] of Object.entries(tree.blobs)) {
		nodes.push(
			{
				name: blob.messages[0]?.text ?? "empty blob",
				id: id,
				parent: blob.parent_id,
				color: 'gray',
				label_color: 'white',
				attributes: { len: blob.messages.length },
				events: {
					click: function (e) {
						window.selectedMessageBlob = window.globalTree.blobs[this.id]
						redrawLinearChat(window.globalTree, selectedMessageBlob);
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
						text: '<b>%name</b>',
						autoWrap: false
					},
					connectorLine_color: "#034efc",
					annotation: {
						padding: 9,
						corners: ['cut', 'square', 'cut', 'square'],
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