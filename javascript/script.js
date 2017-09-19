var infoMenu=document.getElementById("info");var alertsMenu=document.getElementById("alerts");var configMenu=document.getElementById("config");var adminMenu=document.getElementById("admin");var historyMenu=document.getElementById("history");var networkMenu=document.getElementById("network");var alarmMenu=document.getElementById("alarm");var rebootMenu=document.getElementById("reboot");var firmwareMenu=document.getElementById("firmware");var systemtimeMenu=document.getElementById("systemtime");var snmpMenu=document.getElementById("snmp");var defaultColor="#0B304C";var activeColor="#0D6BB1";var dataInterval;var sensorTypes=["N/A","Temperature","Smoke","Temperature and Humidity","Door Switch","Vibration","Dry Contact","Voltage","Leak Rope"];function setDefault(){infoMenu.style.backgroundColor=defaultColor;alertsMenu.style.backgroundColor=defaultColor;configMenu.style.backgroundColor=defaultColor;adminMenu.style.backgroundColor=defaultColor;historyMenu.style.backgroundColor=defaultColor;networkMenu.style.backgroundColor=defaultColor;alarmMenu.style.backgroundColor=defaultColor;rebootMenu.style.backgroundColor=defaultColor;firmwareMenu.style.backgroundColor=defaultColor;systemtimeMenu.style.backgroundColor=defaultColor;snmpMenu.style.backgroundColor=defaultColor;clearInterval(dataInterval)}function setActive(a){setDefault();a.style.backgroundColor=activeColor}function loadContent(c,b,a){var d=new XMLHttpRequest();d.onreadystatechange=function(){if(this.readyState==4&&this.status==200){document.getElementById("display").innerHTML=this.responseText;if(a){a()}}};d.open("GET",c,true);d.send();setActive(document.getElementById(b));if(b.localeCompare("config")==0){setActive(document.getElementById("network"))}if(b.localeCompare("info")==0||b.localeCompare("alerts")==0||b.localeCompare("admin")==0||b.localeCompare("history")==0){closeConfig()}if(b.localeCompare("info")==0){}}function expandConfig(){document.getElementById("configSettings").style.display="block"}function closeConfig(){document.getElementById("configSettings").style.display="none"}function loadJSON(a,c){var b=new XMLHttpRequest();b.onreadystatechange=function(){if(this.readyState==4&&this.status==200){c(this.responseText)}};b.open("GET",a,true);b.send()}function sendJSON(a){var b=new XMLHttpRequest();b.open("GET",a,true);b.send()}function loadSensors(){customDials();dataInterval=setInterval(customDials,15000)}function updateCurrentValues(){loadJSON("current",function(b){var c=JSON.parse(b);for(var a=0;a<c.sensors.length;a++){if(c.sensors[a].type==0){document.getElementById("s"+c.sensors[a].port+"value").innerHTML=c.sensors[a].stringValue}document.getElementById("s"+c.sensors[a].port+"value").style.fontSize="45px";document.getElementById("port"+c.sensors[a].port).style.visibility="hidden";document.getElementById("s"+c.sensors[a].port+"type").innerHTML=sensorTypes[c.sensors[a].type];if(c.sensors[a].name.localeCompare("")!=0){document.getElementById("s"+c.sensors[a].port+"label").innerHTML=c.sensors[a].name}}})}function customDials(){var c,a,b;loadJSON("current",function(f){success:var h=JSON.parse(f);for(var e=0;e<h.sensors.length;e++){c=h.sensors[e].intValue;a=h.sensors[e].stringValue;b=h.sensors[e].port;var g="width";if(window.innerWidth<1000){g="height"}var d=0;switch(h.sensors[e].type){case 1:d=50;break;case 2:case 4:case 6:case 8:d=1;break;case 3:d=100;break;case 5:d=100;break;case 7:d=5;break}dials(c,a,"canvas"+b,d,g,h.sensors[e].type,h.sensors[e].threshMax);document.getElementById("s"+h.sensors[e].port+"type").innerHTML=sensorTypes[h.sensors[e].type];if(h.sensors[e].name.localeCompare("")!=0){document.getElementById("s"+h.sensors[e].port+"label").innerHTML=h.sensors[e].name}}});console.log("=========================")}function dials(o,e,l,u,m,g,h){console.log("DEBUG: "+m);var f=document.getElementById(l);var p=f.getContext("2d");if(m=="width"){f.style.width="100%";var d=f.width=f.offsetWidth;var k=f.height=f.width}else{f.style.height="100%";var k=f.height=f.offsetHeight;var d=f.width=f.height}var r=0;var t=0;var v=0;var q="lightgreen";if(o>=h){q="red"}var a="#222";var n;var i,b;function s(){if(g!=0){p.clearRect(0,0,d,k);p.beginPath();p.strokeStyle=a;p.lineWidth=30;p.arc(d/2,k/2,d/2.5,0,Math.PI*2,false);p.stroke();var w=r*Math.PI/180;p.beginPath();p.strokeStyle=q;p.lineWidth=30;p.arc(d/2,k/2,d/2.5,0-90*Math.PI/180,w-90*Math.PI/180,false);p.stroke()}if(g==2||g==4||g==6||g==8){p.clearRect(0,0,d,k);p.beginPath();p.strokeStyle=q;p.lineWidth=30;p.arc(d/2,k/2,d/2.5,Math.PI,0,false);p.stroke()}p.fillStyle=q;p.font="25px bebas";n=e;text_width=p.measureText(n).width;p.fillText(n,d/2-text_width/2,k/2+15)}function j(){if(typeof i!=undefined){clearInterval(i)}t=Math.round((o/u)*360);if(isNaN(t)){t=r}v=t-r;i=setInterval(c,1000/v)}function c(){if(r==t){clearInterval(i)}if(r<t){r++}else{r--}s()}j()}function setThres(a){loadJSON("current",function(b){success:{var c=JSON.parse(b);document.getElementById("portNum").value=a+1;if(c.sensors[a].type==0){}else{if(c.sensors[a].type==4){document.getElementById("maxThreshold").max=1;document.getElementById("maxThreshMax").innerHTML="Closed";document.getElementById("maxThreshMin").innerHTML="Open";document.getElementById("portName").value=c.sensors[a].name;document.getElementById("maxValue").value=c.sensors[a].threshMax;document.getElementById("maxThreshold").value=c.sensors[a].threshMax;document.getElementById("minThreshRange").style.display="none";document.getElementById("setThresh").value=4;document.getElementById("sensorModal").style.display="block"}else{if(c.sensors[a].type==6){document.getElementById("maxThreshold").max=1;document.getElementById("maxThreshMax").innerHTML="No Contact";document.getElementById("maxThreshMin").innerHTML="Contact";document.getElementById("portName").value=c.sensors[a].name;document.getElementById("maxValue").value=c.sensors[a].threshMax;document.getElementById("maxThreshold").value=c.sensors[a].threshMax;document.getElementById("minThreshRange").style.display="none";document.getElementById("setThresh").value=6;document.getElementById("sensorModal").style.display="block"}else{if(c.sensors[a].type==8){document.getElementById("maxThreshold").max=1;document.getElementById("maxThreshMax").innerHTML="Leak";document.getElementById("maxThreshMin").innerHTML="No Leak";document.getElementById("portName").value=c.sensors[a].name;document.getElementById("maxValue").value=c.sensors[a].threshMax;document.getElementById("maxThreshold").value=c.sensors[a].threshMax;document.getElementById("minThreshRange").style.display="none";document.getElementById("setThresh").value=8;document.getElementById("sensorModal").style.display="block"}else{document.getElementById("minThreshold").max=100;document.getElementById("minThreshMax").innerHTML=100;document.getElementById("maxThreshold").max=100;document.getElementById("maxThreshMax").innerHTML=100;document.getElementById("maxThreshMin").innerHTML=0;document.getElementById("portName").value=c.sensors[a].name;document.getElementById("minThreshold").value=c.sensors[a].threshMin;document.getElementById("minValue").value=c.sensors[a].threshMin;document.getElementById("maxValue").value=c.sensors[a].threshMax;document.getElementById("maxThreshold").value=c.sensors[a].threshMax;document.getElementById("setThresh").value=1;document.getElementById("minThreshRange").style.display="block";document.getElementById("sensorModal").style.display="block"}}}}}})}function updateThresh(){var e=document.getElementById("setThresh").value;var c=document.getElementById("portName").value;var b=document.getElementById("portNum").value;if(e==4||e==6||e==8){var a=document.getElementById("maxThreshold").value;sendJSON("/sensors/port"+b+"/?name="+c+"&maxThresh="+a);document.getElementById("sensorModal").style.display="none";return false}else{var a=document.getElementById("maxThreshold").value;var d=document.getElementById("minThreshold").value;sendJSON("/sensors/port"+b+"/?name="+c+"&maxThresh="+a+"&minThresh="+d);document.getElementById("sensorModal").style.display="none";return false}}function showMinValue(a){document.getElementById("minValue").value=a}function changeMinRange(a){document.getElementById("minThreshold").value=a}function showMaxValue(a){document.getElementById("maxValue").value=a}function changeMaxRange(a){document.getElementById("maxThreshold").value=a}function closeModal(){document.getElementById("sensorModal").style.display="none"}window.onclick=function(a){if(a.target==document.getElementById("sensorModal")){document.getElementById("sensorModal").style.display="none"}};function addRow(c,e,g){var d=document.getElementById("alertsTable");var f=d.insertRow(g);var b=f.insertCell(0);var a=f.insertCell(1);b.appendChild(c);a.innerHTML=e}function loadAlerts(){loadJSON("current",function(c){var d=JSON.parse(c);var a=1;for(var b=0;b<d.sensors.length;b++){if(d.sensors[b].intValue>=d.sensors[b].threshMax){addAlert("Port "+d.sensors[b].port,0,a);a++}else{if(d.sensors[b].intValue<=d.sensors[b].threshMin){addAlert("Port "+d.sensors[b].port,1,a);a++}}}})}function addAlert(b,f,a){var e=[" is above the Max Threshold"," is bellow the Min Threshold"];var d=b+e[f];var c=document.createElement("img");c.src="error.png";addRow(c,d,a)}function loadEmails(){loadJSON("emails",function(a){success:{var b=JSON.parse(a);document.getElementById("email1").value=b[0].email;if(b[0].disable==0){document.getElementById("disableEmail1").checked="checked"}document.getElementById("email2").value=b[1].email;if(b[1].disable==0){document.getElementById("disableEmail2").checked="checked"}document.getElementById("email3").value=b[2].email;if(b[2].disable==0){document.getElementById("disableEmail3").checked="checked"}}})}function updateEmails(){var f=document.getElementById("email1").value;var b=document.getElementById("disableEmail1").checked;if(b==true){b=0}else{b=1}var d=document.getElementById("email2").value;var a=document.getElementById("disableEmail2").checked;if(a==true){a=0}else{a=1}var c=document.getElementById("email3").value;var e=document.getElementById("disableEmail3").checked;if(e==true){e=0}else{e=1}loadJSON("/emails/?email1="+f+"&disable1="+b+"&email2="+d+"&disable2="+a+"&email3="+c+"&disable3="+e);return false}function loadNetwork(){loadJSON("network",function(a){var b=JSON.parse(a);document.getElementById("ipInput").value=b.ip;document.getElementById("subnetInput").value=b.subnet;document.getElementById("gatewayInput").value=b.gateway;document.getElementById("pdnsInput").value=b.pdns;document.getElementById("sdnsInput").value=b.sdns})}function updateNetwork(){var e=document.getElementById("ipInput").value;var b=document.getElementById("subnetInput").value;var d=document.getElementById("gatewayInput").value;var a=document.getElementById("pdnsInput").value;var c=document.getElementById("sdnsInput").value;sendJSON("/network?ip="+e+"&subnet="+b+"&gateway="+d+"&pdns"+a+"&sdns="+c);return false}function reboot(){sendJSON("reboot?true")}function systemDate(){var a=new Date();var b=formatDateTime(a.getDate())+"/"+formatDateTime((a.getMonth()+1))+"/"+formatDateTime(a.getFullYear());document.getElementById("systemDate").value=b}function systemTime(){var b=new Date();var a=formatDateTime(b.getHours())+":"+formatDateTime(b.getMinutes())+":"+formatDateTime(b.getSeconds());document.getElementById("systemTime").value=a}function loadNTP(){loadJSON("ntp",function(a){var b=JSON.parse(a);document.getElementById("NTPServer").value=b.NTP;document.getElementById("timeZone").value="GMT"+b.timeZone;document.getElementById("daylightSavings").value=b.daylight})}function formatDateTime(a){if(a<10){a="0"+a}return a}function loadTime(){systemDate();systemTime();loadNTP();dataInterval=setInterval(systemTime,1000)}function updateDate(){var e;var a=document.getElementsByName("systemTime");for(var f=0;f<a.length;++f){if(a[f].checked){e=a[f].value}}if(e.localeCompare("ntp")==0){var c=document.getElementById("NTPServer").value;var m=document.getElementById("timeZone").value;var l=document.getElementById("daylightSavings").value;if(m.localeCompare("GMT")==0){m="0:00"}else{m=m.replace("GMT","")}sendJSON("/systemTime?NTP="+c+"&timeZone="+m+"&daylight="+l);return false}else{if(e.localeCompare("sysTime")==0){var d=new Date();var h=d.getTime();sendJSON("/systemTime?unix="+h);return false}else{if(e.localeCompare("manual")==0){var n=new Date(document.getElementById("manualDate").value);var k=n.getDate();var g=n.getMonth();var j=n.getYear();var b=document.getElementById("manualTime").value;var h=Date.parse("15 Aug, 2017 16:00:35")/1000;sendJSON("/systemTime?unix="+h);return false}}}}function upgradeFirmware(){}function loadSNMP(){loadJSON("snmp",function(a){var b=JSON.parse(a);document.getElementById("snInput").value=b.sysName;document.getElementById("scInput").value=b.sysContact;document.getElementById("slInput").value=b.sysLocation;document.getElementById("netagentport").value=b.netAgent;document.getElementById("trapport").value=b.trapPort;document.getElementById("snmpv3id").value=b.SNMPv3ID;document.getElementById("snmpv3input").value=b.SNMPv3})}function updateSNMP(){var b=document.getElementById("snInput").value;var g=document.getElementById("scInput").value;var f=document.getElementById("slInput").value;var e=document.getElementById("netagentport").value;var c=document.getElementById("trapport").value;var a=document.getElementById("snmpv3id").value;var d=document.getElementById("snmpv3input").value;sendJSON("/snmp?sysName="+b+"&sysContact="+g+"&sysLocation="+f+"&netAgent"+e+"&trapPort="+c+"&SNMPv3ID"+a+"&SNMPv3"+d);return false}function loadHistory(){var a=["green","blue","red","pink","black","orange","grey","yellow","aqua","maroon","violet","lime"];var g=["tempHistory","smokeHistory","thHistory","doorHistory","vibrHistory","dryHistory","voltHistory"];var e=["tempDiv","smokeDiv","thDiv","doorDiv","vibrDiv","dryDiv","voltDiv"];var d=["M","T","W","T","F","S","S"];var l=[];var h=[];var k=[];var i=[];var c=[];var b=[];var j=[];var f=[l,h,k,i,c,b,j];loadJSON("sensorhistory",function(q){success:{var r=JSON.parse(q);for(var o=0;o<r.length;o++){var p=r[o].type;var n={label:"Port "+r[o].port,data:r[o].data,borderColor:a[o],fill:false};switch(p){case 1:l.push(n);break;case 2:h.push(n);break;case 3:k.push(n);break;case 4:i.push(n);break;case 5:c.push(n);break;case 6:b.push(n);break;case 7:j.push(n);break}}function m(z,y,x,w){var t=document.getElementById(z);if(window.innerWidth>1000){t.width=window.innerWidth/3.3;t.height=window.innerHeight/2.8}else{t.width=window.innerWidth/1.2;t.height=window.innerHeight/2}var u=document.getElementById(z).getContext("2d");var v=new lineChart(t,u,{type:"line",data:{labels:w,datasets:y}});if(y.length==0){document.getElementById(x).style.display="none"}}function s(){for(var t=0;t<7;t++){m(g[t],f[t],e[t],d)}}window.addEventListener("resize",s,false);s()}})}function lineChart(b,m,e){var l=30;var d=b.height-l;m.beginPath();m.moveTo(l,d);m.lineTo(l,l);m.lineWidth=3;m.strokeStyle="#D3D3D3";m.stroke();m.closePath();var a=e.data.datasets.length;var o=0;var r=0;for(var s=0;s<a;++s){for(var q=0;q<e.data.datasets[s].data.length;++q){if(r<e.data.datasets[s].data[q]){r=e.data.datasets[s].data[q]}}}if(r!=1){r=Math.ceil(r/10);r=r*10;var h=(b.height-(l*2))/(r/10);var k=0;for(var s=0;s<=(r/10);++s){m.beginPath();m.moveTo(l-5,d-k);m.lineTo(b.width-l,d-k);m.lineWidth=1;m.strokeStyle="#D3D3D3";m.stroke();m.closePath();m.fillText((s*10),1,d-k);k+=h}}else{m.beginPath();m.moveTo(l-5,d);m.lineTo(l,d);m.lineWidth=1;m.stroke();m.closePath();m.fillText(0,1,d);m.beginPath();m.moveTo(l-5,l);m.lineTo(b.width-l,l);m.lineWidth=1;m.strokeStyle="#D3D3D3";m.stroke();m.closePath();m.fillText(r,1,l)}m.beginPath();m.moveTo(l,d);m.lineTo((b.width-l),d);m.lineWidth=3;m.strokeStyle="#D3D3D3";m.stroke();m.closePath();var u=e.data.labels;var c=(b.width-(l*2))/(u.length-1);var k=0;var n=l-15;var p=l-5;for(var s=0;s<u.length;++s){m.beginPath();m.moveTo((l+k),(b.height-p));m.lineTo((l+k),l);m.lineWidth=1;m.strokeStyle="#D3D3D3";m.stroke();m.closePath();m.fillText(u[s],l+k,b.height-n);k+=c}var f=15;k=0;lineLength=c*0.7;for(var s=0;s<a;++s){if(s>(u.length-1)){f=f+15}m.font="15px Arial";m.fillText(e.data.datasets[s].label,l+k,f);m.beginPath();m.moveTo(l+k,f+5);m.lineTo(l+k+lineLength,f+5);m.lineWidth=5;m.strokeStyle=e.data.datasets[s].borderColor;m.stroke();m.closePath();k+=c}for(var s=0;s<a;++s){k=0;for(var q=0;q<e.data.datasets[s].data.length;++q){var g=e.data.datasets[s].data[q];g=g/r;g=g*(b.height-(l*2));var t=e.data.datasets[s].data[q+1];t=t/r;t=t*(b.height-(l*2));m.beginPath();m.moveTo(l+k,d-g);k+=c;m.lineTo(l+k,d-t);m.lineWidth=3;m.strokeStyle=e.data.datasets[s].borderColor;m.stroke();m.closePath()}}}function updatePass(){var c=document.getElementById("currentPassInput").value;var b=document.getElementById("newPassInput").value;var a=document.getElementById("confirmPassInput").value;if(c.length<4||b.length<4||a.length<4){console.log("ERROR");document.getElementById("errormsg").innerHTML="Passwords must be at least 4 characters long"}else{if(b.localeCompare(a)!=0){console.log("PASS DONT MATCH");document.getElementById("errormsg").innerHTML="Passwords do not match"}else{loadJSON("/admin?currentPass="+c+"&newPass="+b+"&confPass="+a)}}};