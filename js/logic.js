let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
function fillcolor_(depth){
  
  
  if (depth <= 10) {return "green"}
  else if (depth <= 30) {return "blue"}
  else if (depth <= 50) {return "yellow"}
  else if (depth <= 70) {return  "orange"}
  else if (depth <= 90) {return "red"}
  else if (depth > 90) {return "purple"}
  






}

function size(mag){
return (mag + 1 ) * 5




}
d3.json(queryUrl).then(function(data) {
    console.log(data);
    
    createFeatures(data.features);

});

function createFeatures(whatever){

    function onEachFeature(feature, layer){

        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`)
    }





    function geojsonMarkerOptions(feature) {
      return  {
      radius: size(feature.properties.mag),
      fillColor: fillcolor_(feature.geometry.coordinates[2]),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8}
  };
    let earthquakes = L.geoJSON(whatever, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);}, 
          style:geojsonMarkerOptions
      });

    createMap(earthquakes);
    
}

function createMap(earthquakes) {

    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    
      let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  let overlayMaps = {
    Earthquakes: earthquakes
  };

  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

 
  

var legend = L.control({position: 'bottomright'});
legend.onAdd = function(myMap){
    var div = L.DomUtil.create('div', 'legend');
    var categories = ["Depth <= 10 km", "10 km < Depth <= 30 km", "30 km < Depth <= 50 km", "50 km < Depth <= 70 km", "70 km < Depth <= 90 km", "Depth > 90 km"];
    for (var i = 0; i < categories.length; i++) {
      var color = fillcolor_(i * 20); 
      div.innerHTML +=
          '<i style="background:' + color + '"></i> ' +
          categories[i] + '<br>';
  }
    return div;
    
  

};
legend.addTo(myMap);
};