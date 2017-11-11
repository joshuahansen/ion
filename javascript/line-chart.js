function lineChart(t,a,e){var o={head:15,bottom:17,left:30,right:20};addLabels(t,a,e,o),drawAxis(t,a,o,"#D3D3D3"),addAxisValues(t,a,e,o,"#D3D3D3"),addData(t,a,e,o)}function addLabels(t,a,e,o){var d=0,l="15px Arial",s=5;if(t.width<500&&(l="10px Arial",s=3),e.data.datasets.constructor===Array)for(var h=e.data.datasets.length,i=0;i<h;++i){a.font=l,a.fillText(e.data.datasets[i].label,o.left+d,o.head);n=a.measureText(e.data.datasets[i].label).width;a.beginPath(),a.moveTo(o.left+d,o.head+5),a.lineTo(o.left+d+n,o.head+5),a.lineWidth=s,a.strokeStyle=e.data.datasets[i].borderColor,a.stroke(),a.closePath();var r=(d+=10+n)+n+10+o.left;(d+o.left>t.width||r>t.width)&&(o.head+=25,d=0)}else{a.font=l,a.fillText(e.data.datasets.label,o.left,o.head);var n=a.measureText(e.data.datasets.label).width;a.beginPath(),a.moveTo(o.left,o.head+5),a.lineTo(o.left+n,o.head+5),a.lineWidth=s,a.strokeStyle=e.data.datasets.borderColor,a.stroke(),a.closePath()}o.head+=15}function drawAxis(t,a,e,o){var d=t.height-e.bottom;a.beginPath(),a.moveTo(e.left,d),a.lineTo(e.left,e.head),a.lineWidth=3,a.strokeStyle=o,a.stroke(),a.closePath(),a.beginPath(),a.moveTo(e.left,d),a.lineTo(t.width-e.right,d),a.lineWidth=3,a.strokeStyle=o,a.stroke(),a.closePath()}function getMax(t){var a=0;if(t.data.datasets.constructor===Array){var e=t.data.datasets.length;console.log("Length of data array "+e);for(var o=0;o<e;++o)for(d=0;d<t.data.datasets[o].data.length;++d)a<t.data.datasets[o].data[d]&&(a=t.data.datasets[o].data[d])}else for(var d=0;d<t.data.datasets.data.length;++d)a<t.data.datasets.data[d]&&(a=t.data.datasets.data[d]);return console.log("Highest data value: "+a),a}function addAxisValues(t,a,e,o,d){var l=t.height-o.bottom;a.font="10px Arial",console.log(e);var s=getMax(e);if(1!=s){s=Math.ceil(s/10),s*=10;for(var h=(t.height-(o.head+o.bottom))/(s/10),i=0,r=0;r<=s/10;++r)a.beginPath(),a.moveTo(o.left-5,l-i),a.lineTo(t.width-o.right,l-i),a.lineWidth=1,a.strokeStyle=d,a.stroke(),a.closePath(),a.fillText(10*r,1,l-i+5),i+=h}else a.beginPath(),a.moveTo(o.left-5,l),a.lineTo(o.left,l),a.lineWidth=1,a.stroke(),a.closePath(),a.fillText(0,1,l),a.beginPath(),a.moveTo(o.left-5,o.head),a.lineTo(t.width-o.right,o.head),a.lineWidth=1,a.strokeStyle=d,a.stroke(),a.closePath(),a.fillText(s,1,o.left);for(var n=e.data.labels,f=(t.width-(o.left+o.right))/(n.length-1),i=0,g=o.bottom-15,b=o.bottom-5,r=0;r<n.length;++r){a.beginPath(),a.moveTo(o.left+i,t.height-b),a.lineTo(o.left+i,o.head),a.lineWidth=1,a.strokeStyle=d,a.stroke(),a.closePath();var v=a.measureText(n[r]).width/2;a.fillText(n[r],o.left+i-v,t.height-g),i+=f}}function addData(t,a,e,o){var d=t.height-o.bottom,l=0,s=e.data.labels,h=(t.width-(o.left+o.right))/(s.length-1),i=getMax(e);if(1!=i&&(i=Math.ceil(i/10),i*=10),e.data.datasets.constructor===Array)for(var r=e.data.datasets.length,n=0;n<r;++n){l=0;for(f=0;f<e.data.datasets[n].data.length;++f){g=e.data.datasets[n].data[f];g/=i,g*=t.height-(o.head+o.bottom);b=e.data.datasets[n].data[f+1];b/=i,b*=t.height-(o.head+o.bottom),a.beginPath(),a.moveTo(o.left+l,d-g),l+=h,a.lineTo(o.left+l,d-b),a.lineWidth=3,a.strokeStyle=e.data.datasets[n].borderColor,a.stroke(),a.closePath()}}else for(var f=0;f<e.data.datasets.data.length;++f){var g=e.data.datasets.data[f];g/=i,g*=t.height-(o.head+o.bottom);var b=e.data.datasets.data[f+1];b/=i,b*=t.height-(o.head+o.bottom),a.beginPath(),a.moveTo(o.left+l,d-g),l+=h,a.lineTo(o.left+l,d-b),a.lineWidth=3,a.strokeStyle=e.data.datasets.borderColor,a.stroke(),a.closePath()}}