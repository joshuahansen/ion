function createDial(dial)
{
	console.log("CREATE DIAL");
	var canvas = document.getElementById(dial);
	var newDial = canvas.getContext("2d");

	newDial.beginPath();
	newDial.arc(0,0,20,0,0,2*Math.PI);
	newDial.lineWidth = 20;
	newDial.strokeStyle = 'white';
	newDial.stroke();
	newDial.closePath();
	console.log("DIAL CREATED");
}

