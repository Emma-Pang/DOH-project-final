// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  A_grade: new L.LayerGroup(),
  B_grade: new L.LayerGroup(),
  C_grade: new L.LayerGroup(),
};

// Create the map with our layers
var map = L.map("map-id", {
  center: [40.73, -74.0059],
  zoom: 13,
  layers: [
    layers.A_grade,
    layers.B_grade,
    layers.C_grade,
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Grade A Restaurant": layers.A_grade,
  "Grade B Restaurant": layers.B_grade,
  "Grade C Restaurant": layers.C_grade
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// // Create a legend to display information about our map
// var info = L.control({
//   position: "bottomright"
// });

// // When the layer control is added, insert a div with the class of "legend"
// info.onAdd = function() {
//   var div = L.DomUtil.create("div", "legend");
//   return div;
// };
// // Add the info legend to the map
// info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  A_grade: L.ExtraMarkers.icon({
    icon: "ion-happy",
    iconColor: "blue",
    markerColor: "blue",
    shape: "star"
  }),
  B_grade: L.ExtraMarkers.icon({
    icon: "ion-happy",
    iconColor: "orange",
    markerColor: "orange",
    shape: "circle"
  }),
  C_grade: L.ExtraMarkers.icon({
    icon: "ion-sad",
    iconColor: "green",
    markerColor: "green",
    shape: "penta"
  })
};

// THIS IS WHERE WE'RE UPDATING STUFF
function createMarkers(response, which_grade) {
 console.log(response)
  // Pull data off of response.data
  var rest = response.data;

  // Loop through the stations array
  for (var index = 0; index < rest.length; index++) {
    var restaurantthing = rest[index];

    // For each station, create a marker and bind a popup with the station's name
    var restMarker = L.marker([restaurantthing.Latitude, restaurantthing.Longitude], {
      icon: icons[which_grade]
    })
    
    restMarker.addTo(layers[which_grade]);
    restMarker.bindPopup("<h3>" + restaurantthing.Name + "<h3><h3>Cuisine: " + restaurantthing.Cuisine + "<h3><h3>Grade: " + restaurantthing.Grade);

  }
};


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("http://127.0.0.1:5000/a", function(data){
  createMarkers(data, 'A_grade');
});

d3.json("http://127.0.0.1:5000/b", function(data){
  createMarkers(data, 'B_grade');
});

d3.json("http://127.0.0.1:5000/c", function(data){
  createMarkers(data, 'C_grade');
});