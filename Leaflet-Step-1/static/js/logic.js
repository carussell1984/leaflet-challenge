var houstancoordinates = [29.76045, -95.36978];
var mapZoomLevel = 4




var myMap = L.map("map", {
    center: houstancoordinates,
    zoom: mapZoomLevel
});




  // Create the tile layer that will be the background of our map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: "pk.eyJ1IjoiY3J1c3NlbGw4NCIsImEiOiJjazBlbDNiZmMwaXp1M2RuMHkzMjM3bWRkIn0.4DtnPchjhRik4zG6rsSqGA"
}).addTo(myMap);

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(url, function(response) {
    console.log(response)

    var features =  response.features 
      
      console.log(features)
      console.log(features.length)
    for (i=0; i < features.length; i++) {
        var lat = features[i].geometry.coordinates[1];
        var long = features[i].geometry.coordinates[0];
        var mag = features[i].properties.mag;
        var place = features[i].properties.place;
        var time = features[i].properties.time;
        
        var color = "";
        var radius = "";
        if (mag > 5) {
            color = "red";
            radius = 100000;
        }
        else if (mag > 4 ) {
            color = "pink";
            radius = 75000;
        }
        else if (mag > 3 ) {
            color = "orange";
            radius = 50000;
        }
        else if (mag > 2 ) {
            color = "yellow";
            radius = 25000;
        }
        else if (mag > 1 ){
            color = "greenyellow";
            radius = 15000;
        }
        else {
            color = "green";
            radius = 10000;
        }


        if (mag) {
        L.circle([lat, long], {
            fillOpacity: .75,  
            color: "black",
            weight: 0.5,
            fillColor: color, 
            radius: radius
        }).bindPopup("<h3> Location: " + place + "</h3> <hr> <h3>Magnitude: " + mag + "</h3> <hr> <h3> Occured:" + Date(time) + "</h3>").addTo(myMap)
   }
   }

});


function chooseColor(d) {
    return d > 5 ? "#FF0000" :
           d > 4 ? "#FFC0CB" :
           d > 3 ? "#FFA500" :
           d > 2 ? "#FFFF00" :
           d > 1 ?  "#ADFF2F" :
                    "#008000"; 
}
// Create a legend to display information about our map
var legend = L.control({position: "bottomright"});
  
// When the layer control is added, insert a div with the class of "legend"
legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend"),
        grades = [0, 1, 2, 3, 4, 5],
        labels = ["<strong> Magnitude </strong>"];
    
        for (var i = 0; i < grades.length; i++) {
            var from = grades[i];
            var to = grades[i+1];

            labels.push('<i style="background:' + chooseColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
          }


        console.log(labels)
        div.innerHTML = labels.join('<br>');
        return div;
};

// Add the info legend to the map
legend.addTo(myMap);

