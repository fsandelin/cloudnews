var mapWidth = 210;
var mapHeight = 500;
var mapContainer = d3.select("#app").append("div").attr("class", "mapContainer")
                    .attr("width", mapWidth)
                    .attr("height", mapHeight);

var svg = mapContainer.append("svg")
                        .attr("class", "map")
                        .attr("width", mapWidth)
                        .attr("height", mapHeight);



var map = svg.append("g")
            .attr("id", "zoomable");

var transformMatrix = [1, 0, 0, 1, 0, 0];

document.getElementById("zoomable").addEventListener("wheel", function(data) {
    var scale = data.deltaY < 0 ? 1.1 : 0.95;

    for (var i = 0; i < 4; i++) {
        transformMatrix[i] *= scale;
      }

    transformMatrix[4] += ((1 - scale) * 1); //mouse center
    transformMatrix[5] += ((1 - scale) * 1); //mouse center

    var newMatrix = "matrix(" +  transformMatrix.join(' ') + ")";

    svg.attr("transform",newMatrix);
});

var projection = d3.geoMercator().scale(900).translate([-170,1530]);;
var path = d3.geoPath().projection(projection);

d3.json("kommun.json")
    .then(function(data) {
        
        map.selectAll("path")
            .data(topojson.feature(data, data.objects.kommuner).features)
            .enter().append("path")
            .attr("d", path);        
    });
