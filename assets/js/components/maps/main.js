'use strict"'



// Map  objects
//let map = L.map('map').setView([-1.669946, -78.652678], 13);







let map = L.map('map', {
  center: [-1.669946, -78.652678],
  zoom: 10,

});


// Base map layer
let osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap<\/a> contributors',

    
}).addTo(map);
// Shown popup with info
var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});


let popup  = (feature, layer) => {

  //  layer.Icon = customIcon,
    
    layer.bindPopup(`<div>
                        <p style="text-align:right; font-style: italic;">
                            ${feature.properties.tipo}
                        </p>
                        <h3>${feature.properties.nombre}</h3>
                    </div>`);


};


let etiqueta  = (feature, layerParroquias) => {

  //  layer.Icon = customIcon,
    layerParroquias.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
      
  });

  /*layerParroquias.bindPopup(`<div>
            
                        <h3>${feature.properties.txt}</h3>
                        <h4>Total ${feature.properties.total}</h4>
                    </div>`);*/
      


};

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#4FCEF7",
    color: "#4FCEF7",
    weight: 1,
    opacity: 1,
    fillOpacity: 1
};

var myStyle = {
  "color": "#ff7800",
  "weight": 2,
  "opacity": 0.55
};
// L.icon = function (customIcon) {
//     return new L.Icon(customIcon);
// };

// GeoJSON from API Rest



let layer = L.geoJson(null, {
    onEachFeature: popup,

    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng,geojsonMarkerOptions);
    }

});

//  $.getJSON( "http://localhost:3005/api/par", function( valores,status ) {

//  console.log(valores.txt)

// });

//var datos  =  $.getJSON( "http://localhost:3005/api/par");



// var lit1;
// function consumoApi(){
//   var valor ;  
//   let data=fetch('http://localhost:3005/api/par')
//       .then(res => res.json())
//       .then(resultado =>  console.log(resultado) );
//   console.log('valor de data ')
//   console.log(data)
//   return data;
 

// }
// consumoApi();
// fetch('https://pokeapi.co/api/v2/pokemon')
//       .then(response => response.json())
//       .then(json => console.log(json));


//  console.log(data)


var owsrootUrl2 = 'http://142.93.183.43:8080/geoserver/espacioParroquias/ows';

var defaultParameters2 = {
  service: 'WFS',
  version: '2.0.0',
        request: 'GetFeature',
  typeName: 'espacioParroquias:puntosParroquias',
  outputFormat: 'application/json',

};
var parameters2 = L.Util.extend(defaultParameters2);

var URL = owsrootUrl2 + L.Util.getParamString(parameters2);
  
$.ajax({
  url: URL,
  success: function (data) {
    layerParroquias.addData(data);
    soloParroquias.addData(data);

  }
});



function getColor(d) {												
  return d > 8? '#800026' :									
 d > 7 ? '#BD0026' :
 d > 6 ? '#E31A1C' :
 d > 5 ? '#FC4E2A' :
 d > 4 ? '#FD8D3C' :		
 d > 3 ? '#FEB24C' :	
 d > 2 ? '#FED976' :	
 '#FFEDA0';												
  }

  
  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    info.update(layer.feature.properties);
    layer.bringToFront();
}

function resetHighlight(e) {
  layerParroquias.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

  var owsrootUrl = 'http://142.93.183.43:8080/geoserver/espacioPersonas/ows';

var defaultParameters = {
  
  service: 'WFS',
  version: '2.0.0',
        request: 'GetFeature',
  typeName: 'espacioPersonas:personas',
  outputFormat: 'application/json',

};
var parameters = L.Util.extend(defaultParameters);

var URL = owsrootUrl + L.Util.getParamString(parameters);
  
$.ajax({
  url: URL,
  success: function (data) {
    layer.addData(data);
    
  }
});


let colorParroquias=  function(feature) {

return{

  fillColor: getColor(feature.properties.total),
  weight: 2,
  color: 'white',
  dashArray: '3',
  fillOpacity: 0.55
}

}

let layerParroquias = L.geoJson(null, {
  //  style: myStyle,
    onEachFeature: etiqueta,
    style: colorParroquias,
    
});

let soloParroquias = L.geoJson(null,{
  style: colorParroquias,
});
/*$.getJSON("http://localhost:3005/api/layers/personas", (data) => {
    
   layer.addData(data);
 
});*/

/*$.getJSON("http://localhost:3005/api/par", (data) => {
    
   layerParroquias.addData(data);
 
});*/



// var wmsParroquias = L.tileLayer.wms("http://127.0.0.1:8080/geoserver/parroquias/wms?",{
//     layers: "parroquias:PARROQUIAS — Parroquias_Riobamba",
//     format: 'image/png',
//     transparent: true,
//     version: '1.1.1',
//     attribution: "ca"

// });
/////////////////////////////////////////////


//////////////////////////////////////////////



////////////////////////////
var info = L.control();



info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info panelParroquias'); // create a div with a class "info"
    this.update();
    return this._div;
};


// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<div class=infoParroquias> <h4>Parroquias Riobamba</h4>' +  (props ?
        '<b>' + props.txt + '</b><br />' + 'Total: '+ props.total 
        : '</div>');
};


//info.addTo(map);
/////////////////////////////////////////
var info2 = L.control({position: 'topleft'});

info2.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info2'); 
  
  this._div.innerHTML = '  <div>'+
 ' <h2 class="accordion-header" id="panelsStayOpen-headingOne">'+
 '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFS" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">'+
    'Food Security&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
   ' </button></h2>'+
 ' <div id="collapseFS" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">'+
   ' <div class="accordion-body">'+
   '<div class="indicator"><img src="https://cdn.icon-icons.com/icons2/908/PNG/512/family-of-three_icon-icons.com_70744.png" alt=""><div class="content"><span class="name">Population</span><div class="value">17.1<span class="unit">M</span></div></div></div>'+
   '<div class="indicator"><img src="https://cdn.icon-icons.com/icons2/3275/PNG/512/salad_bowl_food_vegetables_vegan_healthy_food_icon_207951.png" alt=""><div class="content"><span class="name">People with insufficient food </span><div class="value">2.6<span class="unit">M</span></div></div></div>'+
    '</div>'+
 ' </div>'+


  '<h2 class="accordion-header" id="panelsStayOpen-headingOne">'+
'<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne"> '  +
'Nutrition'+
' </button></h2>'+
' <div class="accordion-body">'+
' <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">'+
  '<div class="indicator"><img src="https://cdn-icons-png.flaticon.com/512/85/85909.png" alt=""><div class="content"><span class="name">Acute malnutrition</span><div class="value">1.6<span class="unit">%</span></div></div></div><div class="indicator"><img src="https://cdn-icons-png.flaticon.com/512/6047/6047582.png" alt=""><div class="content"><span class="name">Chronic malnutrition</span><div class="value">23.9<span class="unit">%</span></div></div></div> '+
'</div>'+
'</div>'+
'</div>';


  // this._div.innerHTML = '';
  return this._div;
};

///menuMAP
var menu = L.control({position: 'bottomleft'});

menu.onAdd = function (map) {
  this._div = L.DomUtil.create('div'); 
  
  this._div.innerHTML = '<div class="btn-group">'+
'  <input type="radio" class="btn-check" name="options" value="coropletas" id="option1" autocomplete="off" checked />'+
 ' <label class="btn btn-secondary" for="option1">Coropletas</label>'+

'  <input type="radio" class="btn-check" name="options" value="puntos" id="option2" autocomplete="off" />'+
'  <label class="btn btn-secondary" for="option2">Puntos</label>'+

'  <input type="radio" class="btn-check" name="options" id="option3" autocomplete="off" />'+
'  <label class="btn btn-secondary" for="option3">Radio</label>'+
'</div>';


  // this._div.innerHTML = '';
  return this._div;
};

menu.addTo(map);
// method that we will use to update the control based on feature properties passed
info2.update = function (props) {
  this._div.innerHTML = '<h4>Food Security</h4>';
};

info2.addTo(map);
/////////////////////////////////////////
var baseMaps = {
  "OSM": osmLayer,
  "stret": CartoDB_Voyager,
  "oscura": Stadia_AlidadeSmoothDark,
  
};

var overlayMaps = {
"Puntos": layer,
//"Parroquias": layerParroquias,


};


///////////////legend///////////////////////
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [2, 3, 4,5,6,7,8],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};


L.control.layers(baseMaps,overlayMaps ,{
	position: 'topright', // 'topleft', 'bottomleft', 'bottomright'
	collapsed: true
   // true
}).addTo(map);

//layer.addTo(map);

///////mover icono collapse


var menuOptions = document.getElementsByClassName('btn-check');


for(radio in menuOptions) {
  menuOptions[radio].onclick = function() {
  
      if(this.value == "coropletas"){       
        layerParroquias.addTo(map);   
        legend.addTo(map);
        layer.remove();
        info.addTo(map);
     
      }
      if(this.value == "puntos"){
      map.removeLayer(layerParroquias); 
      //map.removeLayer(legend);
      soloParroquias.addTo(map);
        layer.addTo(map);
        legend.remove();
        info.remove();
      
      }
  }
}
