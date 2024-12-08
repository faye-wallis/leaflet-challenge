// Create map object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
});

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Add legend
let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [0, 1, 2, 3, 4];
    let colors = ['#FF0000', '#FF3300', '#FF9900', '#FFFF00', '#66FF00', '#00FF00']; // Example colors
    let labels = ['Earthquake Depth'];

    // Add the minimum and maximum.
    let legendInfo = "<h1>Earthquakes: Past 7 Days</h1>";

    div.innerHTML = legendInfo;

    limits.forEach(function (limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};

legend.addTo(myMap);

// Create function to determine color based on quake depth
function getColor(value) {
    return value > 50 ? '#FF0000' :
        value > 40 ? '#FF3300' :
            value > 30 ? '#FF9900' :
                value > 20 ? '#FFFF00' :
                    value > 10 ? '#66FF00' :
                        '#00FF00';
}

function addMarkers() {
    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then((data) => {
        console.log(data);
        let quakes = data.features;
        for (let i = 0; i < quakes.length; i++) {
            // Define relevant quake qualities as variables
            let geometry = quakes[i].geometry;
            let coordinates = [geometry.coordinates[1], geometry.coordinates[0]];
            let depth = geometry.coordinates[2]
            let magnitude = quakes[i].properties.mag;
            // Set color based on depth, radius based on magnitude, scale up for easy viewing
            L.circle(coordinates, {
                fillOpacity: 0.75,
                color: getColor(depth),
                fillColor: getColor(depth),
                radius: ((magnitude * 20000))
                // Add popups with quake variables
            }).bindPopup(`<h1>${quakes[i].properties.place}</h1> <hr> 
                <h3>Latitude: ${coordinates[0].toLocaleString()}</h3>
                <h3>Longitude: ${coordinates[1].toLocaleString()}</h3>
                <h3>Magnitude: ${magnitude.toLocaleString()}</h3>
                <h3>Depth: ${depth.toLocaleString()}</h3>`).addTo(myMap);
        }
    });
}
addMarkers()