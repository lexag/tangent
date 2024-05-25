
function redrawGraph(tree) {
	var nodes = []
	tree.blobs.forEach(blob => {
		nodes.push(
			{
				name: blob.messages[0].text,
				id: blob.id,
				parent: blob.parent_id,
				color: 'gray',
				label_color: 'white',
				attributes: { len: blob.messages.length }
			}
		)
	});
	var chart = JSC.chart('tree-graph', {
		debug: true,
		type: 'organizational down',
		legend_visible: false,
		chartArea: { 
			fill: ['#121212', '#121212', -90],
		},
		height: "100vh",
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