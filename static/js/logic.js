// Store earthquake API endpoint as queryUrl
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// FUNCTIONS TO CREATE FEATURES OF MARKER-----------------------------------------------------------------------------------------
function markerColor(mag){
  switch (true){
      case (mag <= 1):
      return '#feb24c';        

      case (mag <= 2):
      return '#fd8d3c';        

      case (mag <= 3):
      return '#fc4e2a';        

      case (mag <= 4):
      return '#e31a1c';        

      case (mag <= 5):
      return '#bd0026';        

      case (mag > 5):
      return '#800026';        
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
          onEachFeatures:function (feature,layer)
          {
           
                layer.bindPopup(`<html>Magnitude: ${feature.properties.mag}
                <br> <h2>Location:${feature.properties.place} </h2></html>`);
                
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
  L.control.layers(baseMaps, overlayLayer, {
    collapsed: false
  }).addTo(myMap);

  //  Set up the legend
  const legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    const div = L.DomUtil.create("div", "info legend");
    const labels = ['0-1','1-2','2-3','3-4','4-5','5+'];
    const lableColors = [];
    const labelTexts = [];
  
    labels.forEach(function(label, index){
      lableColors.push(`<listyle="background-color:${markerColor(label[index+1])};"></li>`);
      labelTexts.push(`<span class="legend-label">${label[index]}</span>`)
    });
  
    const labelColorHtml = `<ul ${lableColors.join("")}</ul>`;
    const labelTextHtml = `<div id="labels-text">${labelTexts.join("<br")}></div`;
    const legendInfo = `<h4>Earthquake<br>Magnitude</h4>
                        <div class=\"labels\"${labelColorHtml} ${labelTextHtml}></div>`;
    div.innerHTML = legendInfo;
    return div;
  
  };
  // Adding legend to the map
  legend.addTo(myMap);

}