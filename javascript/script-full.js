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

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() 
	{
    		if (this.readyState == 4 && this.status == 200)
		{
			document.getElementById("display").innerHTML = this.responseText;
			if(loadData)
			{
				loadData();
			}
  	  	}
  	};
	xhttp.open("GET", file, true);
	xhttp.send();	

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
function loadJSON(file, callback)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() 
	{
    		if (this.readyState == 4 && this.status == 200)
		{
			callback(this.responseText);
  	  	}
  	};
	xhttp.open("GET", file, true);
	xhttp.send();	
}
function sendJSON(url)
{
	var xhttp = new XMLHttpRequest();

	xhttp.open("GET",url,true);
	xhttp.send();
}
function loadSensors()
{
	customDials();
	dataInterval = setInterval(customDials, 15000);
}
function updateCurrentValues()
{
	loadJSON("current", function(jsonData) { 
		var data = JSON.parse(jsonData);
		for(var i = 0; i < data.sensors.length; i++)
		{
			//Set value to empty string if no sensor is attached
			if(data.sensors[i].type == 0)
			{
				document.getElementById("s" + data.sensors[i].port + "value").innerHTML = data.sensors[i].stringValue;
			}
			//Set all port Values
			//document.getElementById("s" + data.sensors[i].port + "value").innerHTML = data.sensors[i].stringValue;
			document.getElementById("s" + data.sensors[i].port + "value").style.fontSize = "45px";
			document.getElementById("port" + data.sensors[i].port).style.visibility = "hidden";
			//Set all port types
			document.getElementById("s" + data.sensors[i].port + "type").innerHTML = sensorTypes[data.sensors[i].type];
			//Set all port names
			if(data.sensors[i].name.localeCompare("") != 0)
			{
				document.getElementById("s" + data.sensors[i].port + "label").innerHTML = data.sensors[i].name;
			}
		}
	});
}
function customDials()
{
	var value, stringValue, portNum;
	loadJSON("current", function(jsonData) { 
		success:
		var data = JSON.parse(jsonData);
		for(var i = 0; i < data.sensors.length; i++)
		{
			value = data.sensors[i].intValue;
			stringValue = data.sensors[i].stringValue;
			portNum = data.sensors[i].port;
			//Set all port Values
			var smallestDem = "width";
			/*var smallest = document.getElementById("s" + data.sensors[i].port).offsetWidth;
			console.log("DEBUG: Width = " + smallest);
			console.log("DEBUG: Height = " + document.getElementById("s" + data.sensors[i].port).offsetHeight);
			if(smallest >= document.getElementById("s" + data.sensors[i].port).offsetHeight)
			{
				smallest = document.getElementById("s" + data.sensors[i].port).offsetHeight;
				smallestDem = "height";
			}*/
			if(window.innerWidth < 1000)
			{
				smallestDem = "height"
			}
			var range = 0;
			switch(data.sensors[i].type)
			{
				case 1:
					range = 50;
					break;
				case 2:
				case 4:
				case 6:
				case 8:
					range = 1;
					break;
				case 3:
					range = 100;
					break;
				case 5:
					range = 100
					break;

				case 7:
					range = 5;
					break;
			}

			dials(value, stringValue, "canvas"+portNum, range, smallestDem, data.sensors[i].type, data.sensors[i].threshMax);
			//Set all port types
			document.getElementById("s" + data.sensors[i].port + "type").innerHTML = sensorTypes[data.sensors[i].type];
			//Set all port names
			if(data.sensors[i].name.localeCompare("") != 0)
			{
				document.getElementById("s" + data.sensors[i].port + "label").innerHTML = data.sensors[i].name;
			}
		}
	});
	console.log("=========================");
}

function dials(value, stringValue, canvasID, maxValue, smallestDem, type, maxThresh)
{
	var data = {value: value,
			displayValue: stringValue,
			warningLevel: maxThresh,
			maxValue: maxValue,
			type: type};

	var settings = {canvasID: canvasID,
		dataset: data,
		bgcolor: "#222",
		color: "lightgreen",
		warningColor: "red",
		height: 300,
		width: 250};

	newDial(settings);
}

function setThres(portNum) {
	loadJSON("current", function(jsonData) {
		success: {
			var data = JSON.parse(jsonData);
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
				//set min hreshold for port using current values
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
		sendJSON("/sensors/port" + portNum + "/?name=" + name + "&maxThresh=" + max);
		document.getElementById("sensorModal").style.display = "none";
		return false;
	}
	else 
	{
		var max = document.getElementById("maxThreshold").value;
		var min = document.getElementById("minThreshold").value;
		sendJSON("/sensors/port" + portNum + "/?name=" + name + "&maxThresh=" + max + "&minThresh=" + min);
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
	
	loadJSON("current", function(jsonData) {
		var data = JSON.parse(jsonData);
		var counter = 1;
		for(var i = 0; i < data.sensors.length; i++)
		{
			if(data.sensors[i].intValue >= data.sensors[i].threshMax)
			{
				addAlert("Port " + data.sensors[i].port, 0, counter);
				counter++;
			}
			else if(data.sensors[i].intValue <= data.sensors[i].threshMin)
			{
				addAlert("Port " + data.sensors[i].port, 1, counter);
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
	loadJSON("emails", function(jsonData) {
		success: {
			var data = JSON.parse(jsonData);
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
	
	loadJSON("/emails/?email1=" + email1 + "&disable1=" + disable1 + "&email2=" + email2 + "&disable2=" + disable2 + "&email3=" + email3 + "&disable3=" + disable3);
	return false;
}
/**********************************************************************************/
/*Network Settings*/
function loadNetwork()
{
	loadJSON("network", function(jsonData) {
		var data = JSON.parse(jsonData);
		document.getElementById("ipInput").value = data.ip;
		document.getElementById("subnetInput").value = data.subnet;
		document.getElementById("gatewayInput").value = data.gateway;
		document.getElementById("pdnsInput").value = data.pdns;
		document.getElementById("sdnsInput").value = data.sdns;
	});
}
function updateNetwork()
{
		var ip = document.getElementById("ipInput").value;
		var subnet = document.getElementById("subnetInput").value;
		var gateway = document.getElementById("gatewayInput").value;
		var pdns = document.getElementById("pdnsInput").value;
		var sdns = document.getElementById("sdnsInput").value;

		sendJSON("/network?ip=" + ip + "&subnet=" + subnet + "&gateway=" + gateway + "&pdns" + pdns + "&sdns=" + sdns);
	return false;
}
/*************************************/
/*Reboot*/
function reboot()
{
	sendJSON("reboot?true");
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
	loadJSON("ntp", function(jsonData) {
		var data = JSON.parse(jsonData);
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
	var radioValue;
	var radio = document.getElementsByName('systemTime');
	for(var i = 0; i < radio.length; ++i)
	{
		if(radio[i].checked)
		{
			radioValue = radio[i].value;
		}
	}
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

		
		sendJSON("/systemTime?NTP=" + NTP + "&timeZone=" + timeZone + "&daylight=" + dayLight);
		return false;
	}
	else if(radioValue.localeCompare("sysTime") == 0)
	{
		//SEND SYSTEM TIME IN UNIX TIMESTAMP
		var date = new Date();
		var unixtime = date.getTime();
		sendJSON("/systemTime?unix=" + unixtime);
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
		sendJSON("/systemTime?unix=" + unixtime);
		return false;
	}
}
/**************************************/
/*FIRMWARE*/
function upgradeFirmware()
{

}
/**********************************************************************************/
/*SNMP Settings*/
function loadSNMP()
{
	loadJSON("snmp", function(jsonData) {
		var data = JSON.parse(jsonData)
		document.getElementById("snInput").value = data.sysName;
		document.getElementById("scInput").value = data.sysContact;
		document.getElementById("slInput").value = data.sysLocation;
		document.getElementById("netagentport").value = data.netAgent;
		document.getElementById("trapport").value = data.trapPort;
		document.getElementById("snmpv3id").value = data.SNMPv3ID;
		document.getElementById("snmpv3input").value = data.SNMPv3;
	});
}
function updateSNMP()
{
		var sysName = document.getElementById("snInput").value;
		var sysContact = document.getElementById("scInput").value;
		var sysLocation = document.getElementById("slInput").value;
		var netAgent = document.getElementById("netagentport").value;
		var trapPort = document.getElementById("trapport").value;
		var SNMPv3ID = document.getElementById("snmpv3id").value;
		var SNMPv3 = document.getElementById("snmpv3input").value;

		sendJSON("/snmp?sysName=" + sysName + "&sysContact=" + sysContact + 
			"&sysLocation=" + sysLocation + "&netAgent" + netAgent + 
			"&trapPort=" + trapPort + "&SNMPv3ID" + SNMPv3ID + "&SNMPv3" + SNMPv3);
	return false;
}

/**********************************************************************************/
/*History JS*/
function loadHistory()
{
	var colors = ["green", "blue", "red", "pink", "black", "orange", "grey", "yellow", "aqua", "maroon", "violet", "lime"];
	var chartID = ["tempHistory", "smokeHistory", "thHistory", "doorHistory", "vibrHistory", "dryHistory", "voltHistory"];
	var chartDiv = ["tempDiv", "smokeDiv", "thDiv", "doorDiv", "vibrDiv", "dryDiv", "voltDiv"];
	var hLabels = ['15', '30', '45', '60', '75', '90', '105'];
	var datasetTemp = [];
	var datasetSmoke = [];
	var datasetTH = [];
	var datasetDoor = [];
	var datasetVibr = [];
	var datasetDry = [];
	var datasetVolt = [];
	var datasets = [datasetTemp, datasetSmoke, datasetTH, datasetDoor, datasetVibr, datasetDry, datasetVolt];

	loadJSON("sensorhistory", function(jsonData) {
		success: {
			var data = JSON.parse(jsonData);
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
				if(dataset.length == 0)
				{
					console.log("hiding chart: " + chartDiv);
					document.getElementById(chartDiv).style.display = "none";
				}
				else
				{
					var canvas = document.getElementById(chartID);
					if(window.innerWidth > 1000)
					{
						canvas.width = window.innerWidth/3.3;
						canvas.height = window.innerHeight/2.8;
					}
					else
					{
						canvas.width = window.innerWidth/1.2;
						canvas.height = window.innerHeight/2;
					}
					var sh = document.getElementById(chartID).getContext('2d');
					var chart = new lineChart(canvas, sh, {
						type: "line",
						data: {
							labels: hLabels,
							datasets: dataset
						}
					});
				}
				console.log("Move to next chart");
			}
			function drawCharts()
			{
				for(var count = 0; count < 7; count++)
				{
					console.log("Draw charts")
					addDataset(chartID[count], datasets[count], chartDiv[count], hLabels);
				}
			}
			window.addEventListener('resize', drawCharts, false);
			drawCharts();
			}		
		});
}
/***************************************/
/*ADMIN*/
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
		loadJSON("/admin?currentPass=" + currentPass + "&newPass=" + newPass + "&confPass=" + confPass);
	}
}

