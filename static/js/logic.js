// Store earthquake API endpoint as queryUrl
// Past 30 Days all earthquake data
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// FUNCTIONS TO CREATE FEATURES OF MARKER-----------------------------------------------------------------------------------------
function markerColor(mag){
  switch (true){

      case (mag <= 1):
      return '#c2e699';

      case (mag <= 2):
      return '#ffffb2';        

      case (mag <= 3):
      return '#fecc5c';        

      case (mag <= 4):
      return '#fd8d3c';        

      case (mag <= 5):
      return '#f03b20';        

      case (mag > 5):
      return '#bd0026';        

      
  }
}

function markerSize(mag){

      return (mag * 10000);
  }

// READ GEO JSON--------------------------------------------------------------------------------------------
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    console.log(data.features)
 
    const eqData = L.geoJSON(data.features,      
        {         
         pointToLayer: function (feature, latlng)
          {
            // console.log(feature);
            // console.log(latlng);
                 // Adjust radius and color of marker
                    return L.circle(latlng,
                    {radius: markerSize(feature.properties.mag),
                    opacity: 0.75,
                    color:markerColor(feature.properties.mag) ,
                    fillcolor:markerColor(feature.properties.mag),
                    fillOpacity: 0.75  })
          },
          // Binding a pop-up to each circle
          onEachFeature:function (feature,layer)
          {
           
                layer.bindPopup(`<html><h2>Magnitude: ${feature.properties.mag}<h2><hr><h3>Location: ${feature.properties.place} </h3></html>`);
                
          }
})   
// Call function to create map, add base and tile layer 
makeMap(eqData);

});


// FUNCTION TO CREATE MAP & ADD LAYERS
function makeMap(eqData)
{
// TILE LAYER --------------------------------------------------------------------------------------------------------------
  // Define streetmap and light layers
  const lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });  
// BASE MAP OBJ------------------------------------------------------------------------------------------------------------------
  // Define a baseMaps object to hold our base layers
    const baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap    
  };
// OVERLAY LAYER--------------------------------------------------------------------------------------------------------------------
  const overlayLayer = {
    'Earthquakes': eqData
  };  
// MAP OBJECT----------------------------------------------------------------------------------------------------------------------
  // Create a new map
  const myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [lightmap, eqData]
  });

// LAYER CONTROL-------------------------------------------------------------------------------------------------------------------
  // Create a layer control containing our baseMaps
  L.control.layers(baseMaps, overlayLayer,eqData, {
    // collapsed: false
  }).addTo(myMap);

  //  Set up the legend
  const legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    const div = L.DomUtil.create("div", "info legend");
    const labels = [' 0 - 1 ',' 1 - 2 ',' 2 - 3 ',' 3 - 4 ',' 4 - 5 ',' 5 +'];
    console.log(labels);
    const lableColors = [];
    const labelTexts = [];
  
    labels.forEach(function(label,index){
      console.log(label);
      lableColors.push(`<li style="background: ${markerColor(index+1)};"> <strong>${label}</strong> </li>`);
      });
    console.log(lableColors);
    console.log(labelTexts);
  
    const labelColorHtml = `<ul>${lableColors.join(" ")}</ul>`;
    console.log(labelColorHtml);
    const legendInfo = `<h3><u>LEGEND</u><br></h3><div>${labelColorHtml}<br>Earthquake<br>Magnitude</div>`;
    console.log(legendInfo);
    div.innerHTML = legendInfo;
    return div;
  
  };
  // Adding legend to the map
  legend.addTo(myMap);

}