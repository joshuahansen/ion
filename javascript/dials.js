/*Creating Dials in Canvas using JavaScrpit*/
/*Author: Joshua Hansen*/
/*var settings[canvasID: "", 
	dataset[value: "", 
		displayValue: "", 
		warningLevel: "", 
		maxValue: ""],
	bgcolor: "", 
	color: "", 
	warningColor: "", 
	height: "", 
	width: ""];
*/
function newDial(settings)
{
	var W, H;
	var canvas = document.getElementById(settings.canvasID);
	var ctx = canvas.getContext("2d");

	if(settings.width < settings.height)
	{
		canvas.style.width = '100%';
		
		W = canvas.width = canvas.offsetWidth;
		H = canvas.height = canvas.width;
	}
	else
	{
		canvas.style.height = '100%';

		H = canvas.height = canvas.offsetHeight;
		W = canvas.width = canvas.height;
	}
	var degrees = 0, new_degrees = 0, difference = 0;
	console.log("DEBUG: " + settings.dataset.value);
	console.log("DEBUG: " + settings.dataset.warningLevel);
	if(settings.dataset.value >= settings.dataset.warningLevel)
	{
		var color = settings.warningColor;
	}
	else
	{
		var color = settings.color;
	}

	var animation_loop, redraw_loop;

	function init()
	{
		if(settings.dataset.type != 0)
		{
			ctx.clearRect(0, 0, W, H);
			ctx.beginPath();
			ctx.strokeStyle = settings.bgcolor;
			ctx.lineWidth = 30;
			ctx.arc(W/2, H/2, W/2.5, 0, Math.PI*2, false);
			ctx.stroke();

			var radians = degrees * Math.PI / 180;
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.lineWidth = 30;
			ctx.arc(W/2, H/2, W/2.5, 0 - 90*Math.PI/180, radians - 90*Math.PI/180, false); 
			ctx.stroke();
		}
		if(settings.dataset.type == 2 || 
			settings.dataset.type == 4 || 
			settings.dataset.type == 6 || 
			settings.dataset.type == 8)
		{
			ctx.clearRect(0, 0, W, H);
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.lineWidth = 30;
			ctx.arc(W/2, H/2, W/2.5, Math.PI, 0, false);
			ctx.stroke();
		}
		ctx.fillStyle = color;
		ctx.font = "25px bebas";
		text = settings.dataset.displayValue;
		text_width = ctx.measureText(text).width;
		ctx.fillText(text, W/2 - text_width/2, H/2 + 15);
	}

	function draw()
	{
		if(typeof animation_loop != undefined) clearInterval(animation_loop);
	
		new_degrees = Math.round((settings.dataset.value/settings.dataset.maxValue) * 360 );
		if(isNaN(new_degrees))
		{
			new_degrees = degrees;
		}
		difference = new_degrees - degrees;
		animation_loop = setInterval(animate_to, 1000/difference);
	}

	function animate_to()
	{
		if(degrees == new_degrees) 
		clearInterval(animation_loop);

		if(degrees < new_degrees)
			degrees++;
		else
			degrees--;
		
		init();
	}

	draw();
}
/*
function dials(value, stringValue, canvasID, maxValue, smallestDem, type, maxThresh)
{
	console.log("DEBUG: " + smallestDem);
	var canvas = document.getElementById(canvasID);
	var ctx = canvas.getContext("2d");
	if(smallestDem == "width")
	{
		canvas.style.width = '100%';

		var W = canvas.width = canvas.offsetWidth;
		var H = canvas.height = canvas.width;
	}
	else
	{
		canvas.style.height = '100%';

		var H = canvas.height = canvas.offsetHeight;
		var W = canvas.width = canvas.height;
	}
	var degrees = 0;
	var new_degrees = 0;
	var difference = 0;
	var color = "lightgreen";
	if(value >= maxThresh)
	{
		color = "red";
	}
	var bgcolor = "#222";
	var text;
	var animation_loop, redraw_loop;
	
	function init()
	{
		if(type != 0)
		{
			ctx.clearRect(0, 0, W, H);
			ctx.beginPath();
			ctx.strokeStyle = bgcolor;
			ctx.lineWidth = 30;
			ctx.arc(W/2, H/2, W/2.5, 0, Math.PI*2, false);
			ctx.stroke();

			var radians = degrees * Math.PI / 180;
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.lineWidth = 30;
			ctx.arc(W/2, H/2, W/2.5, 0 - 90*Math.PI/180, radians - 90*Math.PI/180, false); 
			ctx.stroke();
		}
		if(type == 2 || type == 4 || type == 6 || type == 8)
		{
			ctx.clearRect(0, 0, W, H);
			ctx.beginPath();
			ctx.strokeStyle = color;
			ctx.lineWidth = 30;
			ctx.arc(W/2, H/2, W/2.5, Math.PI, 0, false);
			ctx.stroke();
		}
		ctx.fillStyle = color;
		ctx.font = "25px bebas";
		text = stringValue;
		text_width = ctx.measureText(text).width;
		ctx.fillText(text, W/2 - text_width/2, H/2 + 15);
	}
	
	function draw()
	{
		if(typeof animation_loop != undefined) clearInterval(animation_loop);
		
		new_degrees = Math.round((value/maxValue) * 360 );
		if(isNaN(new_degrees))
		{
			new_degrees = degrees;
		}
		difference = new_degrees - degrees;
		animation_loop = setInterval(animate_to, 1000/difference);
	}
	
	function animate_to()
	{
		if(degrees == new_degrees) 
		clearInterval(animation_loop);
	
		if(degrees < new_degrees)
			degrees++;
		else
			degrees--;
		
		init();
	}
	
	draw();
}*/
