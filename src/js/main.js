var data_points=[];
var main={};
var mymap;
var coord={"Delhi":{"lat":28.613459424004414,"lng":77.21467658816192},"Patna":{"lat":25.611809521055477,"lng":85.12308292748081},"Guwahati":{"lat":26.144343428856374,"lng":91.75296660845501},"Muzaffarpur":{"lat":28.613459424004414,"lng":77.21467658816192},"Rajamahendravaram":{"lat":17.013053,"lng":81.797783},"Amravati":{"lat":20.921382,"lng":77.750765},"Vijayawada":{"lat":16.528575,"lng":80.646528},"Visakhapatnam":{"lat":17.725026,"lng":83.243472}};

function searchStringInArray (str, strArray) {
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].match(str)) return j;
    }
    return -1;
}



$(document).ready(function(){
	console.log("Hello Wolrd!");

	//fetch data
	var API = "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69?api-key=579b464db66ec23bdd000001f9c5312de2f14cd97748e00142abd2b9&format=json&offset=0";
	$.getJSON(API, {format: "json"}).done(function(data) {
	        $.each( data.records, function(key, value) {
  				data_points.push(value);
			});
			preprocess_data(data_points);
			$("#time").text(data_points[0]["last_update"]);
			$("#statuss").css({backgroundColor:"#66cc00",color:"black"});
			$("#statuss").text("Connected");
	    });
	

	
mymap = L.map('mapArea').setView([28.7041, 77.1025], 5);
			L.control.scale().addTo(mymap);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

			}).addTo(mymap);
			L.marker([28.7041, 77.1025]).addTo(mymap)
			    .bindPopup('Delhi');

			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  			}).addTo(mymap);
			var geocodeService = L.esri.Geocoding.geocodeService();
			var clickCircle;

			mymap.on('click', function(e) {


				if (clickCircle != undefined) {
			      mymap.removeLayer(clickCircle);
			    };
			    


			    mymap.flyTo(e.latlng,zoom=9);

			    // clickCircle = L.circle(e.latlng, 16009 * 3, {
			    //   color: '#f07300',
			    //   fillOpacity: 0.4,
			    //   opacity: 0.5,
			    // }).addTo(mymap);

			    // var crust = Object.keys(main);
			    // var build="<div>Data Unavailable</div>";

			    // geocodeService.reverse().latlng(e.latlng).run(function(error, result) {
			    // 	var city = result.address.City;
			    // 	console.log(city);
			    // 	if(searchStringInArray(city,crust)!=-1)
			    // 	{
			    //   	var h = computeAQI(main,city);
			    //   	build = "<div><span>NO2: "+h[2]+"</span><br><span>SO2: "+h[3]+"</span><br><span>CO: "+h[4]+"</span><br><span>O3: "+h[6]+"</span><br><span>PM10: "+h[0]+"</span><br><span>PM2.5: "+h[1]+"</span><br><span>NH3: "+h[5]+"</span></div>";
			    //   	}

			    //   L.marker(result.latlng).addTo(mymap).bindPopup(build).openPopup();
			    //   console.log(e.latlng);
			    // });

			    
			  });

		
			  
			var options = {
			  key: '29d1e1f69ad447b9a040850b01ece81e',
			  limit: 10,
			  position: 'topright',
			    placeholder: 'Search...', // the text in the empty search box
			    errorMessage: 'Nothing found.',
			    showResultIcons: false,
			    collapsed: true,
			    expand: 'click'
			   // favour results near here
			};
			

			var control = L.Control.openCageSearch(options).addTo(mymap);
			
			setTimeout(function(){initiazieMap();},1000);



});


function initiazieMap(){
	//for maps
		var b=Object.keys(main);
		var tems;
 		var color;

 		coords={"Delhi":{"lat":28.613459424004414,"lng":77.21467658816192},"Patna":{"lat":25.611809521055477,"lng":85.12308292748081},"Guwahati":{"lat":26.144343428856374,"lng":91.75296660845501},"Muzaffarpur":{"lat":28.613459424004414,"lng":77.21467658816192},"Rajamahendravaram":{"lat":17.013053,"lng":81.797783},"Amravati":{"lat":20.921382,"lng":77.750765},"Vijayawada":{"lat":16.528575,"lng":80.646528},"Visakhapatnam":{"lat":17.725026,"lng":83.243472}};

 		for(var i=0;i<b.length;i++){
			 		tems=Math.max.apply(Math, computeAQI(main,b[i]));
			 		
			 		if(tems<=51)
			 		{
			 			color="#008000";
			 		}
			 		else if(tems<=101)
			 		{
			 			color="#1aff1a";
			 		}
			 		else if(tems<=201)
			 		{
			 			color="#e6e600";
			 		}
			 		else if(tems<=301)
			 		{
			 			color="#ff8080";
			 		}
			 		else if(tems<=431)
			 		{
			 			color="#e60000";
			 		}
			 		else
			 		{	
			 			color="#4d0000";
			 		}

 				mapper(mymap,color,coords[b[i]],b[i]);
			 		
 			}
}

	function preprocess_data(data_points){
			
			a={}
			var last=data_points[0].city;
			//console.log(last);
			for(var i=0;i<data_points.length;i++)
			{
			
			
				

				if(data_points[i].city!=last)
				{
					main[data_points[i].city] = a;
					a={}
					last=data_points[i].city;

				}
				

				if(data_points[i].pollutant_id=="NO2")
				{
					if(data_points[i].pollutant_avg!="NA" && !isNaN(data_points[i].pollutant_avg))
					{
						a["NO"]= data_points[i].pollutant_avg;
					}

				}
				else if(data_points[i].pollutant_id=="CO")
				{
					if(data_points[i].pollutant_avg!="NA" && !isNaN(data_points[i].pollutant_avg))
					{
						a["CO"]= data_points[i].pollutant_avg;		
					}
				}
				else if(data_points[i].pollutant_id=="SO2")
				{
					if(data_points[i].pollutant_avg!="NA" && !isNaN(data_points[i].pollutant_avg))
					{
						a["SO2"]= data_points[i].pollutant_avg;	
					}
				}
				else if(data_points[i].pollutant_id=="OZONE")
				{
					if(data_points[i].pollutant_avg!="NA" && !isNaN(data_points[i].pollutant_avg))
					{
						a["O3"]= data_points[i].pollutant_avg;	
					}
				}
				else if(data_points[i].pollutant_id=="PM2.5")
				{
					if(data_points[i].pollutant_avg!="NA" && !isNaN(data_points[i].pollutant_avg))
					{
						a["PM25"]= data_points[i].pollutant_avg;
					}
				}
				else if(data_points[i].pollutant_id=="PM10" && !isNaN(data_points[i].pollutant_avg))
				{
					if(data_points[i].pollutant_avg!="NA")
					{
						a["PM10"]= data_points[i].pollutant_avg;
					}	
				}
				else if(data_points[i].pollutant_id=="NH3" && !isNaN(data_points[i].pollutant_avg))
				{
					if(data_points[i].pollutant_avg!="NA")
					{
						a["NH3"]= data_points[i].pollutant_avg;
					}		
				}

			}

			var tt = Object.keys(main);
			for(var i=0;i<tt.length;i++)
			{

				$("#mySelect").append("<option value="+String(tt[i])+">"+tt[i]+"</option>");
				
				
			}

		
			// console.log(computeAQI(main,"Patna"));
			cityPol(main);

			console.log(main);

			

		
	}

	function computeElementIndex(elem,data)
	{
		var AQI = [0,51,101,201,301,401,500];

		elem.push(data);
		AQI.push(data);

		elem.sort(function(a, b){return a - b});
		AQI.sort(function(a, b){return a - b});

		var Blow = elem[elem.indexOf(data)-1];
		var Bhi = elem[elem.indexOf(data)+1];

		var Ilow = AQI[AQI.indexOf(data)-1];
		var Ihi = AQI[AQI.indexOf(data)+1];


		if(!(isNaN(Blow)) || !(isNaN(Bhi)) || !(isNaN(Ilow)) || !(isNaN(Ihi)))
		{
			//AQI formula
			var score = (((Ihi-Ilow)/(Bhi-Blow))*(data-Blow)) + Ilow;
			if(!(isNaN(score))){
				return(score);
			}
			else
			{
				return(0);
			}
		}
		else
		{
			return(0);
		}


		
		

	}

	function computeAQI(data,city)
	{
		
		var CO, NO2, SO2, O3, NH3, PM25, PM10=0;
		var indices = [];
		// console.log(data[city]);

		CO = data[city]["CO"];
		NO2 = data[city]["NO2"];
		NH3 = data[city]["NH3"];
		SO2 = data[city]["SO2"]
		O3 = data[city]["O3"];
		PM25 = data[city]["PM25"];
		PM10 = data[city]["PM10"];



		var PM10_breakpoints = [0,51,101,241,351,430,500];
		var PM25_breakpoints = [0,31,61,91,121,250,300];
		var NO2_breakpoints = [0,41,81,181,281,400,500];
		var SO2_breakpoints = [0,41,81,381,801,1600,2000];
		var CO_breakpoints = [0,1.1,2.1,10.0,17.0,34.0,40.0];
		var NH3_breakpoints = [0,201,401,801,1200,1800,2200];
		var O3_breakpoints = [0,51,101,169,209,748,1000];
		

		indices.push(computeElementIndex(PM10_breakpoints,PM10));
		indices.push(computeElementIndex(PM25_breakpoints,PM25));
		indices.push(computeElementIndex(NO2_breakpoints,NO2));
		indices.push(computeElementIndex(SO2_breakpoints,SO2));
		indices.push(computeElementIndex(CO_breakpoints,CO));
		indices.push(computeElementIndex(NH3_breakpoints,NH3));
		indices.push(computeElementIndex(O3_breakpoints,O3));
		// console.log(indices);
		return(indices);

		

	}

	//top 3 AQI, bad and good
	//top 1 param, bad and good
	//history on all values

	//last updated


	// Enter a speed between 0 and 180
	



function queryNow() {

  		  			
  			var x = document.getElementById("mySelect").value;
  			var t = computeAQI(main,x);
  			console.log(Math.max.apply(Math, t));
  			runGauge(Math.max.apply(Math, t));
  			display(x,coord[x]);
  			loadCityData(main,x);
  			$("#city").text(x);

}

function queryNow2() {

  		  			
  			var x = document.getElementById("mySelect2").value;
  			top3(main,x);

 }




 function top3(data,para)
 {	
 		var a=Object.keys(data);
 		var bucket=[];
 		var x=[];
 		

 		if(para=="AQI")
 		{
 			
 			var temp;
 			for(var i=0;i<a.length;i++)
 			{
 				temp=computeAQI(data,a[i]);
 				bucket.push(Math.max.apply(Math, temp));
 				x.push(a[i]);
 			}

 		}
 		else{
 		
 		t={};

 		for(var k=0;k<a.length;k++){

 			if(isNaN(data[a[k]][para])){

 				
 				data[a[k]][para]=0;
 				
 			}
 			else
 			{
 				t[data[a[k]][para]]=a[k];
 			}
 		}
 	
 		var key = Object.keys(t);
 		
 		x=Object.values(t);

 		for(var i=0;i<key.length;i++)
 		{
 			bucket.push(parseInt(key[i]));

 		}
 	}
 		console.log(bucket);
 		if(bucket.length>0){
 		bars(x,bucket,para);}
 		else{
 			alert("Data Not Available!");
 		}
 		
			
 }
 function cityPol(data){
		
 		var ku = Object.keys(data);
 		var vals = [];
 		var labs = [];
		for(var i=0;i<ku.length;i++)
		{
			var h = Math.max.apply(Math, computeAQI(data,ku[i]));
			labs.push(ku[i]);
			vals.push(h);
		}
		console.log(ku,labs,vals);
		var data = [{
			  values: vals,
			  labels: labs,
			  domain: {column: 0},
			  name: 'AQI',
			  hoverinfo: 'label+percent+name',
			  hole: .4,
			  type: 'pie'
			}];

			var layout = {
			  title: 'Air Quality Index Contributors',
			  grid: {rows: 1, columns: 1},
			  showlegend: false,
			  height:600,
			  width:600
			  
			  
			};

			setTimeout(function(){Plotly.newPlot('main2', data, layout)},4000);


	}


function bars(a,b,title){

	var col = [];
	for(var i=0;i<a.length;i++)
	{
		if(i==(a.length-1))
		{
			col.push('rgba(222,45,38,0.8)');
		}
		else
		{
			col.push('rgba(204,204,204,1)');
		}
	}
	var trace1 = {
		  x: a,
		  y: b,
		  marker:{
		    color: col
		  },
		  type: 'bar'
		};

		var data = [trace1];

		var layout = {
		  title: 'Cities by '+title,
		  height: 600,
			width: 600,
		};

		setTimeout(function(){Plotly.newPlot('myDiv', data, layout)},1000);


}


function runGauge(level){

			// Trig to calc meter point
			// console.log(level);
			var degrees = 180 - level/2.7,
				 radius = .5;
			var radians = degrees * Math.PI / 180;
			var x = radius * Math.cos(radians);
			var y = radius * Math.sin(radians);

			// Path: may have to change to create a better triangle
			var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
				 pathX = String(x),
				 space = ' ',
				 pathY = String(y),
				 pathEnd = ' Z';
			var path = mainPath.concat(pathX,space,pathY,pathEnd);

			var data = [{ type: 'scatter',
			   x: [0], y:[0],
				marker: {size: 12, color:'850000'},
				showlegend: false,
				name: 'AQI',
				text: level,
				hoverinfo: 'text+name'},
			  { values: [100/6, 100/6, 100/6, 100/6, 50/6, 50/6, 83],
			  rotation: 90,
			  text: ['Severe!', 'Very Poor', 'Poor', 'Moderate',
						'Satisfactiory', 'Good'],
			  textinfo: 'text',
			  textposition:'inside',	  
			  marker: {colors:['rgba(210, 0, 0, .8)', 'rgba(255, 0, 0, .5)',
									 'rgba(255, 194, 0, .5)', 'rgba(238, 181, 180, .5)',
									 'rgba(123, 210, 82, .5)', 'rgba(0, 186, 83, .5)',
									 'rgba(255, 255, 255, 0)']},
			  labels: ['>401', '301-400', '201-300', '101-200', '51-100', '0-50'],
			  hoverinfo: 'label',
			  hole: .4,
			  type: 'pie',
			  showlegend: false
			}];

			var layout = {
			  shapes:[{
			      type: 'path',
			      path: path,
			      fillcolor: '850000',
			      line: {
			        color: '850000'
			      }
			    }],
			  title: 'AQI',
			  height: 450,
			  width: 470,
			  margin: {
			    l: 7,
			    r: 7,
			    b: 100,
			    t: 40,
			    pad: 2
			  },
			  xaxis: {zeroline:false, showticklabels:false,
						 showgrid: false, range: [-1, 1]},
			  yaxis: {zeroline:false, showticklabels:false,
						 showgrid: false, range: [-1, 1]}
			};

			Plotly.newPlot('main', data, layout);

	}



function loadCityData(data,city)
	{

		var val = computeAQI(data,city);

	  google.charts.load('current', {'packages':['bar']});
      google.charts.setOnLoadCallback(drawStuff);
      arr=[['Parameter', 'Value', { role: 'style' }]];
      brr=["PM10","PM2.5","NO2","SO2","C0","NH3","O3"];
      for(var i=0;i<val.length;i++)
      {
      	if(!(val[i]==0))
      	{
      		arr.push([brr[i],val[i],'#4da6ff']);
      	}
      }
      function drawStuff() {
        var data = new google.visualization.arrayToDataTable(
          arr
        );

        var options = {
          title: 'Chess opening moves',
          width: 470,
          height:300,
          legend: { position: 'none' },
          chart: { },
          bars: 'horizontal', // Required for Material Bar Charts.
          axes: {
            x: {
              0: { side: 'top', label: 'Air Quality Indicators'} // Top x-axis.
            }
          },
          bar: { groupWidth: "90%" }
        };

        var chart = new google.charts.Bar(document.getElementById('top_x_div'));
        chart.draw(data, options);
      };
}
	//cityPol();
function display(e,cord)
{
	console.log(e);
	var h = computeAQI(main,e);
	$("#city").text(e);
	build = "<div><span>NO2: "+h[2]+"</span><br><span>SO2: "+h[3]+"</span><br><span>CO: "+h[4]+"</span><br><span>O3: "+h[6]+"</span><br><span>PM10: "+h[0]+"</span><br><span>PM2.5: "+h[1]+"</span><br><span>NH3: "+h[5]+"</span></div>";
	 mymap.flyTo(cord,zoom=9);
		L.marker(cord).addTo(mymap).bindPopup(build).openPopup();
	
}
function mapper(mymap,color,coords,id)
{
	clickCircle = L.circle(coords, 16009 * 3, {
			      color: color,
			      id: 1,
			      fillOpacity: 0.4,
			      opacity: 0.5,
			    }).addTo(mymap).on("click", function(){display(id,coords);});
}
///masp


			


