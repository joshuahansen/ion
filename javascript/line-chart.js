/*
 * Creating Line Charts in Canvas using JavaScrpit
 * Author: Joshua Hansen
 */

/*
 * Main function for creating a line chart
 */
function lineChart(canvas, chart, attributes)
{
	/*defualt settings*/
	var padding = {
		head: 15,
		bottom: 15,
		left: 30,
		right: 20
	}
	var lineColor = "#D3D3D3";
	/*
	 * function calls for the line chart
	 * add labels then draw axis to allow labels to cross multiple lines
	 */
	addLabels(canvas, chart, attributes, padding);
	drawAxis(canvas, chart, padding, lineColor);
	addAxisValues(canvas, chart, attributes, padding, lineColor);
	addData(canvas, chart, attributes, padding);
}
/*
 * Add labels for the datasets
 * Add color labels for each dataset to identify each one 
 */
function addLabels(canvas, chart, attributes, padding)
{
	var spacing = 10;
	var originalLabelStart = 0;
	var newLabelStart = originalLabelStart;
	var fontSize = "15px Arial";
	var lineWidth = 5;
	if(canvas.width < 500)
	{
		fontSize = "10px Arial";
		lineWidth = 3;
	}

	if(attributes.data.datasets.constructor === Array)
	{
		var rangeOfValues = attributes.data.datasets.length;
		for(var i = 0; i < rangeOfValues; ++i)
		{
			chart.font = fontSize;
			chart.fillText(attributes.data.datasets[i].label, padding.left + newLabelStart, padding.head);
			var lineLength = chart.measureText(attributes.data.datasets[i].label).width;
			
			chart.beginPath();
			chart.moveTo(padding.left + newLabelStart, padding.head + 5);
			chart.lineTo(padding.left + newLabelStart + lineLength , padding.head + 5);
			chart.lineWidth = lineWidth;
			chart.strokeStyle = attributes.data.datasets[i].borderColor;
			chart.stroke();
			chart.closePath();
			newLabelStart += spacing + lineLength;
			var nextLabelEnd = newLabelStart + lineLength + spacing + padding.left;
			if(newLabelStart+ padding.left > canvas.width || nextLabelEnd > canvas.width)
			{
				padding.head += 25;
				newLabelStart = originalLabelStart;
			}
		}
	}
	else
	{
		chart.font = fontSize;
		chart.fillText(attributes.data.datasets.label, padding.left, padding.head);
		var lineLength = chart.measureText(attributes.data.datasets.label).width;
		chart.beginPath();
		chart.moveTo(padding.left, padding.topPadding + 10);
		chart.lineTo(padding.left + lineLength , padding.head + 10);
		chart.lineWidth = lineWidth;
		chart.strokeStyle = attributes.data.datasets.borderColor;
		chart.stroke();
		chart.closePath();
	}
	padding.head += 10;
}

/*
 * Draw the chart axis
 */
function drawAxis(canvas, chart, padding, lineColor)  //lineColor = #D3D3D3
{
	var chartStart = canvas.height - padding.bottom;

	/*draw y-axis*/
	chart.beginPath();
	chart.moveTo(padding.left, chartStart);
	chart.lineTo(padding.left, padding.head);
	chart.lineWidth = 3;
	chart.strokeStyle = lineColor;
	chart.stroke();
	chart.closePath();

	/*draw x-axix*/
	chart.beginPath();
	chart.moveTo(padding.left, chartStart);
	chart.lineTo((canvas.width - padding.right), chartStart);
	chart.lineWidth = 3;
	chart.strokeStyle = lineColor;
	chart.stroke();
	chart.closePath();
}
/*
 * Get the maximum data point.
 * Return the max value to allow the graph to be scaled
 * to best fit the data
 */
function getMax(attributes)
{
	var max = 0;
	if(attributes.data.datasets.constructor === Array)
	{
		var rangeOfValues = attributes.data.datasets.length;
		console.log("Length of data array " + rangeOfValues);
		for(var i = 0; i < rangeOfValues; ++i)
		{
			for(var j = 0; j < attributes.data.datasets[i].data.length; ++j)
			{
				if(max < attributes.data.datasets[i].data[j])
				{
					max = attributes.data.datasets[i].data[j];
				}
			}
		}
	}
	else
	{
		for(var j = 0; j < attributes.data.datasets.data.length; ++j)
		{
			if(max < attributes.data.datasets.data[j])
			{
				max = attributes.data.datasets.data[j];
			}
		}
	}
	console.log("Highest data value: " + max);
	return max;
}
/*
 * Add X and Y values to the axis
 * values need to line up with the relevant grid lines
 */
function addAxisValues(canvas, chart, attributes, padding, lineColor) //lineColor = #D3D3D3
{
	var chartStart = canvas.height - padding.bottom;
	chart.font = "10px Arial";
	console.log(attributes);	
	/*add y-axis values*/

	var point = 0;
	var max = getMax(attributes);
	if(max != 1)
	{
		max = Math.ceil(max/10);
		max = max * 10;
	
		var pointDist = (canvas.height - (padding.head + padding.bottom))/(max/10);
		var newPoint = 0;
		for(var i = 0; i <= (max/10); ++i)
		{
			chart.beginPath();
			chart.moveTo(padding.left - 5, chartStart - newPoint);
			chart.lineTo(canvas.width - padding.right, chartStart - newPoint);
			chart.lineWidth = 1;
			chart.strokeStyle = lineColor;
			chart.stroke();
			chart.closePath();
			chart.fillText((i * 10), 1, chartStart - newPoint + 5);
			newPoint += pointDist;
		}
	}
	else
	{
		chart.beginPath();
		chart.moveTo(padding.left - 5, chartStart);
		chart.lineTo(padding.left, chartStart);
		chart.lineWidth = 1;
		chart.stroke();
		chart.closePath();
		chart.fillText(0, 1, chartStart);
		chart.beginPath();
		chart.moveTo(padding.left - 5, padding.head);
		chart.lineTo(canvas.width - padding.right, padding.head);
		chart.lineWidth = 1;
		chart.strokeStyle = lineColor;
		chart.stroke();
		chart.closePath();
		chart.fillText(max, 1, padding.left);
	}
	
	/*add x-axis values*/
	var labels = attributes.data.labels;
	var spacing = (canvas.width - (padding.left + padding.right)) / (labels.length - 1);
	var newPoint = 0;
	var axisLabel = padding.bottom - 15;
	var axisDash = padding.bottom - 5;
	for(var i = 0; i < labels.length; ++i)
	{
		chart.beginPath();
		chart.moveTo((padding.left + newPoint), (canvas.height - axisDash));
		chart.lineTo((padding.left + newPoint), padding.head);
		chart.lineWidth = 1;
		chart.strokeStyle = lineColor;
		chart.stroke();
		chart.closePath();
		var labelMiddle = chart.measureText(labels[i]).width/2;
		chart.fillText(labels[i], padding.left + newPoint - labelMiddle, canvas.height - axisLabel);
		newPoint += spacing;
	}
}
/*
 * Add the data to the chart
 * checks if multiple datasets for same chart then adds all data points
 */
function addData(canvas, chart, attributes, padding,)
{
	var chartStart = canvas.height - padding.bottom;
	var newPoint = 0;
	var labels = attributes.data.labels;
	var spacing = (canvas.width - (padding.left + padding.right)) / (labels.length - 1);
	var max = getMax(attributes);
	if(max != 1)
	{
		max = Math.ceil(max/10);
		max = max * 10;
	}
	if(attributes.data.datasets.constructor === Array)
	{
		var rangeOfValues = attributes.data.datasets.length;
		for(var i = 0; i < rangeOfValues; ++i)
		{
			newPoint = 0;
			for(var j = 0; j < attributes.data.datasets[i].data.length; ++j)
			{
				var currentPoint = attributes.data.datasets[i].data[j];
				currentPoint = currentPoint/max;
				currentPoint = currentPoint * (canvas.height - (padding.head + padding.bottom));
			
				var nextPoint = attributes.data.datasets[i].data[j+1];
				nextPoint = nextPoint/max;
				nextPoint = nextPoint * (canvas.height - (padding.head + padding.bottom));
			
				chart.beginPath();
				chart.moveTo(padding.left + newPoint, chartStart - currentPoint);
				newPoint += spacing;
				chart.lineTo(padding.left + newPoint, chartStart - nextPoint);
				chart.lineWidth = 3;
				chart.strokeStyle = attributes.data.datasets[i].borderColor;
				chart.stroke();
				chart.closePath();
			}
		}
	}
	else
	{
		for(var j = 0; j < attributes.data.datasets.data.length; ++j)
		{
			var currentPoint = attributes.data.datasets.data[j];
			currentPoint = currentPoint/max;
			currentPoint = currentPoint * (canvas.height - (padding.head + padding.bottom));
			
			var nextPoint = attributes.data.datasets.data[j+1];
			nextPoint = nextPoint/max;
			nextPoint = nextPoint * (canvas.height - (padding.head + padding.bottom));
			
			chart.beginPath();
			chart.moveTo(padding.left + newPoint, chartStart - currentPoint);
			newPoint += spacing;
			chart.lineTo(padding.left + newPoint, chartStart - nextPoint);
			chart.lineWidth = 3;
			chart.strokeStyle = attributes.data.datasets.borderColor;
			chart.stroke();
			chart.closePath();
		}

	}
}
