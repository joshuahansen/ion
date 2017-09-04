var infoMenu = document.getElementById("info");
var alertsMenu = document.getElementById("alerts");
var configMenu = document.getElementById("config");
var adminMenu = document.getElementById("admin");
var historyMenu = document.getElementById("history");

var networkMenu = document.getElementById("network");
var alarmMenu = document.getElementById("alarm");
var rebootMenu = document.getElementById("reboot");
var firmwareMenu = document.getElementById("firmware");
var systemtimeMenu = document.getElementById("systemtime");
var snmpMenu = document.getElementById("snmp");

var defaultColor = "#0B304C";
var activeColor = "#0D6BB1";
var dataInterval;

/**********************************************************************************/
/*Sensors JS*/
var sensorTypes = ["N/A", "Temperature", "Smoke", "Temperature and Humidity", "Door Switch", "Vibration", "Dry Contact", "Voltage", "Leak Rope"];

/**********************************************************************************/
/*NAV JS*/
function setDefault() {
	infoMenu.style.backgroundColor = defaultColor;
	alertsMenu.style.backgroundColor = defaultColor;
	configMenu.style.backgroundColor = defaultColor;
	adminMenu.style.backgroundColor = defaultColor;
	historyMenu.style.backgroundColor = defaultColor;
	networkMenu.style.backgroundColor = defaultColor;
	alarmMenu.style.backgroundColor = defaultColor;
	rebootMenu.style.backgroundColor = defaultColor;
	firmwareMenu.style.backgroundColor = defaultColor;
	systemtimeMenu.style.backgroundColor = defaultColor;
	snmpMenu.style.backgroundColor = defaultColor;

	clearInterval(dataInterval);
}
	
function setActive(menuId) {
	setDefault();
	menuId.style.backgroundColor = activeColor;
}

function loadContent(file, activeMenuId, loadData) {
	$("#display").load(file, loadData);
	setActive(document.getElementById(activeMenuId));
	if(activeMenuId.localeCompare("config") == 0)
	{
		setActive(document.getElementById("network"));
	}
	if(activeMenuId.localeCompare("info") == 0 || activeMenuId.localeCompare("alerts") == 0 ||
		activeMenuId.localeCompare("admin") == 0 || activeMenuId.localeCompare("history") == 0)
	{
		closeConfig();
	}
	if(activeMenuId.localeCompare("info") == 0)
	{
		updateCurrentDials();
	}
}

function expandConfig() {
	document.getElementById("configSettings").style.display = "block";
}

function closeConfig() {
	document.getElementById("configSettings").style.display = "none";
}

/**********************************************************************************/
/*Info JS*/
function loadSensors()
{
//	dataInterval = setInterval(updateCurrentDials, 15000);
	updateCurrentDials();
}
function updateCurrentValues()
{
	$.getJSON("current", function(data) { 
		for(var i = 0; i < data.sensors.length; i++)
		{
			//Set value to empty string if no sensor is attached
			if(data.sensors[i].type == 0)
			{
				$("#s" + data.sensors[i].port + "value").text("");
			}
			//Set all port Values
			$("#s" + data.sensors[i].port + "value").text(data.sensors[i].stringValue);
			//Set all port types
			$("#s"+ data.sensors[i].port + "type").text(sensorTypes[data.sensors[i].type]);
			//Set all port names
			if(data.sensors[i].name.localeCompare("") != 0)
			{
				$("#s" + data.sensors[i].port + "label").text(data.sensors[i].name);
				
			}
		}
	});
}
function updateCurrentDials()
{
	$.getJSON("current", function(data) { 
		success:
		for(var i = 0; i < data.sensors.length; i++)
		{
			//Set value to empty string if no sensor is attached
			if(data.sensors[i].type == 0)
			{
				$("#s" + data.sensors[i].port + "value").text("");
			}
			//Set all port types
			$("#s"+ data.sensors[i].port + "type").text(sensorTypes[data.sensors[i].type]);

			//Sets name of sensor
			if(data.sensors[i].name.localeCompare("") != 0)
			{
				$("#s" + data.sensors[i].port + "label").text(data.sensors[i].name);
			}
			//Set all port Values
			$("#s" + data.sensors[i].port + "value").text(data.sensors[i].stringValue);
			//Creates Dials
			$('.dial').knob({
				'change' : function (v) { console.log(v); }
			});
			$('.dial-thresh').knob({
				'change' : function (v) { console.log(v); }
			});
			if(data.sensors[i].type == 4 || data.sensors[i].type == 6 || data.sensors[i].type == 8)
			{
				if(data.sensors[i].intValue != data.sensors[i].threshMax)
				{
					$('#port' + data.sensors[i].port).trigger(
						'configure',
						{
							"min":0,
							"max":1,
							"fgColor":"#f21313",
							"bgColor": "#43f943",
							"inputColor": "#43f943",
							"displayInput": false,
							"angleArc": 180,
							"angleOffset": -90
						}
					);
				}
				else
				{
					$('#port' + data.sensors[i].port).trigger(
						'configure',
						{
							"min":0,
							"max":1,
							"fgColor":"#f21313",
							"bgColor": "#43f943",
							"inputColor": "#f21313",
							"displayInput": false,
							"angleArc": 180,
							"angleOffset": -90
						}
					);
				}
			}
			else 
			{
				if(data.sensors[i].intValue > data.sensors[i].threshMax)
				{
					$('#port' + data.sensors[i].port).trigger(
						'configure',
						{
							"min":0,
							"max":100,
							"fgColor":"#f21313",
							"inputColor": "#f21313"
						}
					);
				}
				else
				{
					$('#port' + data.sensors[i].port).trigger(
						'configure',
						{
							"min":0,
							"max":100,
							"fgColor":"#43f943",
							"inputColor": "#43f943"
						}
					);
				}
			}
			$('.dialThresh').trigger(
				'configure',
				{
					"min":0,
					"max":100,
					"fgColor": "#f21313"
				}
			);
			$('#port' + data.sensors[i].port)
				.val(data.sensors[i].intValue)
				.trigger('change');
		}
	});
}	
function setThres(portNum) {
	$.getJSON("current", function(data) {
		success: {
			document.getElementById("portNum").value = portNum + 1;
			if(data.sensors[portNum].type == 0) 
			{
				//do nothing
			}
			else if(data.sensors[portNum].type == 4)
			{
				//set threshold for door and dry contact sensors
				document.getElementById("maxThreshold").max = 1;
				document.getElementById("maxThreshMax").innerHTML = "Closed";
				document.getElementById("maxThreshMin").innerHTML = "Open";

				document.getElementById("portName").value = data.sensors[portNum].name;
				//set max threshold for port using current values
				document.getElementById("maxValue").value = data.sensors[portNum].threshMax;
				document.getElementById("maxThreshold").value = data.sensors[portNum].threshMax;
				document.getElementById("minThreshRange").style.display = "none";
				document.getElementById("setThresh").value = 4;

				document.getElementById("sensorModal").style.display = "block";
			}
			else if(data.sensors[portNum].type == 6)
			{
				//set thresh for contact sensors
				document.getElementById("maxThreshold").max = 1;
				document.getElementById("maxThreshMax").innerHTML = "No Contact";
				document.getElementById("maxThreshMin").innerHTML = "Contact";

				document.getElementById("portName").value = data.sensors[portNum].name;
				//set max threshold for port using current values
				document.getElementById("maxValue").value = data.sensors[portNum].threshMax;
				document.getElementById("maxThreshold").value = data.sensors[portNum].threshMax;
				document.getElementById("minThreshRange").style.display = "none";
				document.getElementById("setThresh").value = 6;

				document.getElementById("sensorModal").style.display = "block";
			}
			else if(data.sensors[portNum].type == 8)
			{
				//set thresh for leak rope
				document.getElementById("maxThreshold").max = 1;
				document.getElementById("maxThreshMax").innerHTML = "Leak";
				document.getElementById("maxThreshMin").innerHTML = "No Leak";

				document.getElementById("portName").value = data.sensors[portNum].name;
				//set max threshold for port using current values
				document.getElementById("maxValue").value = data.sensors[portNum].threshMax;
				document.getElementById("maxThreshold").value = data.sensors[portNum].threshMax;
				document.getElementById("minThreshRange").style.display = "none";
				document.getElementById("setThresh").value = 8;

				document.getElementById("sensorModal").style.display = "block";
			}
			else
			{
				//set sensors values for teperature sensors
				document.getElementById("minThreshold").max = 100;
				document.getElementById("minThreshMax").innerHTML = 100;
	
				document.getElementById("maxThreshold").max = 100;
				document.getElementById("maxThreshMax").innerHTML = 100;
				document.getElementById("maxThreshMin").innerHTML = 0;

				document.getElementById("portName").value = data.sensors[portNum].name;
				//set min threshold for port using current values
				document.getElementById("minThreshold").value = data.sensors[portNum].threshMin;
				document.getElementById("minValue").value = data.sensors[portNum].threshMin;
				//set max threshold for port using current values
				document.getElementById("maxValue").value = data.sensors[portNum].threshMax;
				document.getElementById("maxThreshold").value = data.sensors[portNum].threshMax;
				document.getElementById("setThresh").value = 1;
				
				document.getElementById("minThreshRange").style.display = "block";
				document.getElementById("sensorModal").style.display = "block";
			}

		}
	});
}
function updateThresh()
{
	var setThreshValue = document.getElementById("setThresh").value;
	var name = document.getElementById("portName").value;
	var portNum = document.getElementById("portNum").value;
	
	if(setThreshValue == 4 || setThreshValue == 6 || setThreshValue == 8)
	{
		var max = document.getElementById("maxThreshold").value;
		$.getJSON("/sensors/port" + portNum + "/?name=" + name + "&maxThresh=" + max);
		document.getElementById("sensorModal").style.display = "none";
		return false;
	}
	else 
	{
		var max = document.getElementById("maxThreshold").value;
		var min = document.getElementById("minThreshold").value;
		$.getJSON("/sensors/port" + portNum + "/?name=" + name + "&maxThresh=" + max + "&minThresh=" + min);
		document.getElementById("sensorModal").style.display = "none";
		return false;
	}
}
function showMinValue(value)
{
	document.getElementById("minValue").value = value;
}
function changeMinRange(value)
{
	document.getElementById("minThreshold").value = value;
}
function showMaxValue(value)
{
	document.getElementById("maxValue").value = value;
}
function changeMaxRange(value)
{
	document.getElementById("maxThreshold").value = value;
}

function closeModal() {
	document.getElementById("sensorModal").style.display = "none";
}

window.onclick = function(event) {
	if(event.target == document.getElementById("sensorModal")) {
		document.getElementById("sensorModal").style.display = "none";
	}
}
/**********************************************************************************/
/*Alerts JS*/
function addRow(stats, descr, rowNum) {
	var table = document.getElementById("alertsTable");
	var row = table.insertRow(rowNum);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);

	cell1.appendChild(stats);
	cell2.innerHTML = descr;
}

function loadAlerts() {
	
	$.getJSON("current", function(data) {
		var counter = 1;
		for(var i = 0; i < data.sensors.length; i++)
		{
			if(data.sensors[i].intValue > data.sensors[i].threshMax)
			{
				addAlert("Port " + data.sensors[i].port, 1, counter);
				counter++;
			}
			else if(data.sensors[i].intValue < data.sensors[i].threshMin)
			{
				addAlert("Port " + data.sensors[i].port, 0, counter);
				counter++;
			}

		}
	});
}

function addAlert(port, thresh, counter)
{
	var msg = [" is above the Max Threshold", " is bellow the Min Threshold"]
	var descr = port + msg[thresh];
	var stats = document.createElement('img');
	stats.src = "error.png";
	addRow(stats, descr, counter);
}

/*Alarms JS*/
/*******************************************************************************/
function loadEmails()
{
	$.getJSON("emails", function(data) {
		success: {
			//load email 1
			document.getElementById("email1").value = data[0].email;
			if(data[0].disable == 0)
			{
				document.getElementById("disableEmail1").checked = "checked";
			}
			//load email 2
			document.getElementById("email2").value = data[1].email;
			if(data[1].disable == 0)
			{
				document.getElementById("disableEmail2").checked = "checked";
			}
			//load email 3
			document.getElementById("email3").value = data[2].email;
			if(data[2].disable == 0)
			{
				document.getElementById("disableEmail3").checked = "checked";
			}
		}
	});
}
function updateEmails()
{
	//email 1
	var email1 = document.getElementById("email1").value;
	var disable1 = document.getElementById("disableEmail1").checked;
	if(disable1 == true)
	{
		disable1 = 0;
	}
	else
	{
		disable1 = 1;
	}
	//email 2
	var email2 = document.getElementById("email2").value;
	var disable2 = document.getElementById("disableEmail2").checked;
	if(disable2 == true)
	{
		disable2 = 0;
	}
	else
	{
		disable2 = 1;
	}
	//email 3
	var email3 = document.getElementById("email3").value;
	var disable3 = document.getElementById("disableEmail3").checked;
	if(disable3 == true)
	{
		disable3 = 0;
	}
	else
	{
		disable3 = 1;
	}
	
	$.getJSON("/emails/?email1=" + email1 + "&disable1=" + disable1 + "&email2=" + email2 + "&disable2=" + disable2 + "&email3=" + email3 + "&disable3=" + disable3);
/*	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "emails?email1=" + email1 + "&disable1=" + disable1 + "&email2=" + email2 + "&disable2=" + disable2 + "&email3=" + email3 + "&disable3=" + disable3, true);
	xhttp.send();*/
	return false;
}

/**********************************************************************************/
/*Network Settings*/
function updateNetwork()
{
		var ip = document.getElementById("ipInput").value;
		var subnet = document.getElementById("subnetInput").value;
		var gateway = document.getElementById("gatewayInput").value;
		var pdns = document.getElementById("pdnsInput").value;
		var sdns = document.getElementById("sdnsInput").value;

	/*	var xhttp = new XMLHttpRequest();
		xhttp.open("GET", "network?ip=" + ip + "&subnet=" + subnet + "&gateway=" + gateway + "&pdns" + pdns + "&sdns=" + sdns, true);
		xhttp.send();*/
		$.getJSON("/network?ip=" + ip + "&subnet=" + subnet + "&gateway=" + gateway + "&pdns" + pdns + "&sdns=" + sdns);
	return false;
}

function loadNetwork()
{
	$.getJSON("network", function(data) {
		document.getElementById("ipInput").value = data.ip;
		document.getElementById("subnetInput").value = data.subnet;
		document.getElementById("gatewayInput").value = data.gateway;
		document.getElementById("pdnsInput").value = data.pdns;
		document.getElementById("sdnsInput").value = data.sdns;
	});
}

/**********************************************************************************/
/*Reboot Settings*/
function reboot()
{
	$.getJSON("reboot?true");
}

/**********************************************************************************/
/*System Time Settings*/
function systemDate()
{
	var currentDate = new Date();
	var formattedDate =  formatDateTime(currentDate.getDate()) + "/" + formatDateTime((currentDate.getMonth() + 1)) + "/" + formatDateTime(currentDate.getFullYear());
	document.getElementById("systemDate").value = formattedDate;
}
function systemTime()
{
	var currentTime = new Date();
	var formattedTime = formatDateTime(currentTime.getHours()) + ":" + formatDateTime(currentTime.getMinutes()) + ":" + formatDateTime(currentTime.getSeconds());
	document.getElementById("systemTime").value = formattedTime

}
function loadNTP()
{
	$.getJSON("ntp", function(data) {
		document.getElementById("NTPServer").value = data.NTP;
		document.getElementById("timeZone").value = "GMT" + data.timeZone;
		document.getElementById("daylightSavings").value = data.daylight;
	});
}

function formatDateTime(dateTime)
{
	if(dateTime < 10)
	{
		dateTime = "0" + dateTime;
	}
	return dateTime;
}
function loadTime()
{
	systemDate();
	systemTime();
	loadNTP();
	dataInterval = setInterval(systemTime, 1000);
}
function updateDate()
{
	var radioValue = $("input[name='systemTime']:checked").val();

	if(radioValue.localeCompare("ntp") == 0)
	{	
		//SEND UPDATE FEQUENCY, SERVER IP, TIME ZONE, AND DAYLIGHT SAVINGS
		var NTP = document.getElementById("NTPServer").value;
		var timeZone = document.getElementById("timeZone").value;
		var dayLight = document.getElementById("daylightSavings").value;
		if(timeZone.localeCompare("GMT") == 0)
		{
			timeZone = "0:00";
		}
		else
		{
			timeZone = timeZone.replace("GMT", "");
		}

		
		$.getJSON("/systemTime?NTP=" + NTP + "&timeZone=" + timeZone + "&daylight=" + dayLight);
		return false;
	}
	else if(radioValue.localeCompare("sysTime") == 0)
	{
		//SEND SYSTEM TIME IN UNIX TIMESTAMP
		var date = new Date();
		var unixtime = date.getTime();
		$.getJSON("/systemTime?unix=" + unixtime);
		return false;
	}
	else if(radioValue.localeCompare("manual") == 0)
	{
		//CONVERT MANUAL INPUT TO UNIX TIMESTAMP
		var manDate = new Date(document.getElementById("manualDate").value);
		var day = manDate.getDate();
		var month = manDate.getMonth();
		var year = manDate.getYear();
		var time = document.getElementById("manualTime").value;
		var unixtime = Date.parse("15 Aug, 2017 16:00:35")/1000;
		$.getJSON("/systemTime?unix=" + unixtime);
		return false;
	}
}

/**********************************************************************************/
/*SNMP Settings*/
function updateSNMP()
{
		var sysName = document.getElementById("snInput").value;
		var sysContact = document.getElementById("scInput").value;
		var sysLocation = document.getElementById("slInput").value;
		var netAgent = document.getElementById("netagentport").value;
		var trapPort = document.getElementById("trapport").value;
		var SNMPv3ID = document.getElementById("snmpv3id").value;
		var SNMPv3 = document.getElementById("snmpv3input").value;

		$.getJSON("/snmp?sysName=" + sysName + "&sysContact=" + sysContact + 
			"&sysLocation=" + sysLocation + "&netAgent" + netAgent + 
			"&trapPort=" + trapPort + "&SNMPv3ID" + SNMPv3ID + "&SNMPv3" + SNMPv3);
	return false;
}

function loadSNMP()
{
	$.getJSON("snmp", function(data) {
		document.getElementById("snInput").value = data.sysName;
		document.getElementById("scInput").value = data.sysContact;
		document.getElementById("slInput").value = data.sysLocation;
		document.getElementById("netagentport").value = data.netAgent;
		document.getElementById("trapport").value = data.trapPort;
		document.getElementById("snmpv3id").value = data.SNMPv3ID;
		document.getElementById("snmpv3input").value = data.SNMPv3;
	});
}

/**********************************************************************************/
/*History JS*/
function loadHistory()
{
	var colors = ["green", "blue", "red", "pink", "black", "orange", "grey", "purple", "aqua", "maroon", "violet", "lime"];
	var chartID = ["tempHistory", "smokeHistory", "thHistory", "doorHistory", "vibrHistory", "dryHistory", "voltHistory"];
	var chartDiv = ["tempDiv", "smokeDiv", "thDiv", "doorDiv", "vibrDiv", "dryDiv", "voltDiv"];
	var hLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	var datasetTemp = [];
	var datasetSmoke = [];
	var datasetTH = [];
	var datasetDoor = [];
	var datasetVibr = [];
	var datasetDry = [];
	var datasetVolt = [];
	var datasets = [datasetTemp, datasetSmoke, datasetTH, datasetDoor, datasetVibr, datasetDry, datasetVolt];

	$.getJSON("sensorhistory", function(data) {
		success: {
			
			for(var i = 0; i < data.length; i++)
			{
				var type = data[i].type;
				var datasetValue = {
					label: "Port " + data[i].port,
					data: data[i].data,
					borderColor: colors[i],
					fill: false
					}
				switch(type) {
					case 1:
						datasetTemp.push(datasetValue);
						break;
					case 2:
						datasetSmoke.push(datasetValue);
					break;
					case 3:
						datasetTH.push(datasetValue);
						break;
					case 4:
						datasetDoor.push(datasetValue);
						break;
					case 5:
						datasetVibr.push(datasetValue);
						break;
					case 6:
						datasetDry.push(datasetValue);
						break;
					case 7:
						datasetVolt.push(datasetValue);
						break;
				}
			}

			function addDataset(chartID, dataset, chartDiv, hLabels)
			{
				var canvas = document.getElementById(chartID);
				canvas.width = window.innerWidth/4;
				canvas.height = window.innerHeight/4;
				var sh = document.getElementById(chartID).getContext('2d');
				var chart = new lineChart(canvas, sh, {
					type: "line",
					data: {
						labels: hLabels,
						datasets: dataset
					}
				});
			
				if(dataset.length == 0)
				{
					document.getElementById(chartDiv).style.display = "none";
				}
			}
			
			for(var count = 0; count < 7; count++)
			{
				addDataset(chartID[count], datasets[count], chartDiv[count], hLabels);
			}
			}		
		});
}
function lineChart(canvas, chart, attributes)
{
	console.log("CREATE NEW CHART");
	var padding = 30;
	/*draw y-axis*/
	chart.beginPath();
	chart.moveTo(padding,(canvas.height - padding));
	chart.lineTo(padding,padding);
	chart.lineWidth = 3;
	chart.strokeStyle = "#D3D3D3"
	chart.stroke();
	chart.closePath();
	/*add y-axis values*/
	var rangeOfValues = attributes.data.datasets.length;
	console.log(rangeOfValues);
	var point = 0;
	var max = 0;
	for(var i = 0; i < rangeOfValues; ++i)
	{
		console.log(attributes.data.datasets[i]);
		for(var j = 0; j < attributes.data.datasets[i].data.length; ++j)
		{
			console.log(attributes.data.datasets[i].data[j]);
			if(max < attributes.data.datasets[i].data[j])
			{
				max = attributes.data.datasets[i].data[j];
			}
		}
		console.log("Max: " + max);
	}
	if(max != 1)
	{
		max = Math.ceil(max/10);
		max = max * 10;
	
		console.log("NEW MAX = " + max);
	
		var pointDist = (canvas.height - (padding * 2))/(max/10);
		var newPoint = 0;
		console.log("POINT DISTANCE: " + pointDist);
		for(var i = 0; i <= (max/10); ++i)
		{
			console.log("ADD POINT: " + i*10);
			chart.beginPath();
			chart.moveTo(padding - 5, canvas.height - padding - newPoint);
			chart.lineTo(canvas.width - padding, canvas.height - padding - newPoint);
			chart.lineWidth = 2;
			chart.strokeStyle = "#D3D3D3"
			chart.stroke();
			chart.closePath();
			chart.fillText((i * 10), 1, canvas.height - padding - newPoint);
			newPoint += pointDist;
		}
	}
	else
	{
		console.log("ADD POINTS: " + 0);
		chart.beginPath();
		chart.moveTo(padding - 5, canvas.height - padding);
		chart.lineTo(padding, canvas.height - padding);
		chart.lineWidth = 2;
		chart.stroke();
		chart.closePath();
		chart.fillText(0, 1, canvas.height - padding);
		console.log("ADD POINTS: " + 0 + " " + max);
		chart.beginPath();
		chart.moveTo(padding - 5, padding);
		chart.lineTo(canvas.width - padding, padding);
		chart.lineWidth = 2;
		chart.strokeStyle = "#D3D3D3"
		chart.stroke();
		chart.closePath();
		chart.fillText(max, 1, padding);
	}
	/*draw x-axis*/
	chart.beginPath();
	chart.moveTo(padding,(canvas.height - padding));
	chart.lineTo((canvas.width - padding),(canvas.height - padding));
	chart.lineWidth = 3;
	chart.strokeStyle = "#D3D3D3"
	chart.stroke();
	chart.closePath();

}
/**********************************************************************************/
/*Admin JS*/
function updatePass()
{
	var currentPass = document.getElementById("currentPassInput").value;
	var newPass = document.getElementById("newPassInput").value;
	var confPass = document.getElementById("confirmPassInput").value;
	
	if(currentPass.length < 4 || newPass.length < 4 || confPass.length < 4)
	{
		console.log("ERROR");
		document.getElementById("errormsg").innerHTML = "Passwords must be at least 4 characters long"; 
	}
	else if(newPass.localeCompare(confPass) != 0)
	{
		console.log("PASS DONT MATCH");
		document.getElementById("errormsg").innerHTML = "Passwords do not match";
	}
	else 
	{
		$.getJSON("/admin?currentPass=" + currentPass + "&newPass=" + newPass + "&confPass=" + confPass);
	}
}
