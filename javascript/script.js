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
var sensorTypes = ["N/A", "Temperature", "Smoke", "Temperature and Humidity", "Door Switch", "Vibration", "Dry Contact", "Voltage"];

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
	if(activeMenuId.localeCompare("info") == 0 || activeMenuId.localeCompare("alerts") == 0 ||
		activeMenuId.localeCompare("admin") == 0 || activeMenuId.localeCompare("history") == 0)
	{
		closeConfig();
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
	dataInterval = setInterval(updateCurrentValues, 1500);
	updateCurrentValues();
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
function setThres(portNum) {
	$.getJSON("current", function(data) {
		success: {
			if(data.sensors[portNum].type != 0 && data.sensors[portNum].type !=4) 
			{
				document.getElementById("minThreshold").max = 100;
				document.getElementById("minThreshMax").innerHTML = 100;
	
				document.getElementById("maxThreshold").max = 100;
				document.getElementById("maxThreshMax").innerHTML = 100;

				document.getElementById("modalHeading").innerHTML = "Set Port " + portNum + " Threshold";
				//set min threshold for port using current values
				document.getElementById("minThreshold").value = data.sensors[portNum].threshMin;
				document.getElementById("minValue").value = data.sensors[portNum].threshMin;
				//set max threshold for port using current values
				document.getElementById("maxValue").value = data.sensors[portNum].threshMax;
				document.getElementById("maxThreshold").value = data.sensors[portNum].threshMax;

				document.getElementById("sensorModal").style.display = "block";
			}
			else if(data.sensors[portNum].type == 4)
			{
				//set threshold for door and dry contact sensors
			}
		}
	});
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

	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "emails?email1=" + email1 + "&disable1=" + disable1 + "&email2=" + email2 + "&disable2=" + disable2 + "&email3=" + email3 + "&disable3=" + disable3, true);
	xhttp.send();
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

		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", "network?ip=" + ip + "&subnet=" + subnet + "&gateway=" + gateway + "&pdns" + pdns + "&sdns=" + sdns, true);
		xhttp.send();
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
/*System Time Settings*/
function systemDate()
{
	var currentDate = new Date();
	var formattedDate =  formatDateTime(currentDate.getDate()) + "/" + formatDateTime((currentDate.getMonth() + 1)) + "/" + formatDateTime(currentDate.getFullYear());
	document.getElementById("systemDate").innerHTML = formattedDate;
}
function systemTime()
{
	var currentTime = new Date();
	var formattedTime = formatDateTime(currentTime.getHours()) + ":" + formatDateTime(currentTime.getMinutes()) + ":" + formatDateTime(currentTime.getSeconds());
	document.getElementById("systemTime").innerHTML = formattedTime

}
function formatDateTime(dateTime)
{
	if(dateTime < 10)
	{
		dateTime = "0" + dateTime;
	}
	return dateTime;
}
function loadSystemTime()
{
	systemDate();
	systemTime();
	dataInterval = setInterval(systemTime, 1000);
}
function updateDate()
{
	var radioValue = $("input[name='systemTime']:checked").val();

	if(radioValue.localeCompare("ntp") == 0)
	{	
		//SEND UPDATE FEQUENCY, SERVER IP, TIME ZONE, AND DAYLIGHT SAVINGS
		console.log("DEBUG: ntp");
		/*var xhttp = new XMLHttpRequest();
		xhttp.open("GET", "admin?currentPass=" + currentPass + "&newPass=" + newPass + "&confPass=" + confPass, true);
		xhttp.send();*/
		return false;
	}
	else if(radioValue.localeCompare("sysTime") == 0)
	{
		//SEND SYSTEM TIME IN UNIX TIMESTAMP
		console.log("DEBUG: sysTime");
		/*var xhttp = new XMLHttpRequest();
		xhttp.open("GET", "admin?currentPass=" + currentPass + "&newPass=" + newPass + "&confPass=" + confPass, true);
		xhttp.send();*/
		return false;
	}
	else if(radioValue.localeCompare("manual") == 0)
	{
		//CONVERT MANUAL INPUT TO UNIX TIMESTAMP
		console.log("DEBUG: manual");
		/*var xhttp = new XMLHttpRequest();
		xhttp.open("GET", "admin?currentPass=" + currentPass + "&newPass=" + newPass + "&confPass=" + confPass, true);
		xhttp.send();*/
		return false;
	}
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
					};
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
				var sh = document.getElementById(chartID).getContext('2d');
				var chart = new Chart(sh, {
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
/**********************************************************************************/
/*Admin JS*/
function updatePass()
{
	var currentPass =  document.getElementById("currentPass").value;
	var newPass = document.getElementById("newPassInput").value;
	var confPass = document.getElementById("confirmPassInput").value;

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "admin?currentPass=" + currentPass + "&newPass=" + newPass + "&confPass=" + confPass, true);
	xhttp.send();
}
