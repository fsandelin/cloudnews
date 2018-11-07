var swedenMap = newSwedenMap();




function newSwedenMap(type) {
    var typeFileName = type === "municipalities" ? "sweden-municipalities.json" : "sweden-counties.json";
    var SIZE = 1.1;
    var RATIO = 2.1;
    var mapContainerWidth = SIZE * 230;
    var mapContainerHeight = mapContainerWidth * RATIO;
    
    var zoom = d3.zoom()
        .scaleExtent([0.5, 20])
        .on("zoom", zoomed);
    
    var mapContainer = d3.create("svg").attr("class", "mapContainer")
                        .attr("width", mapContainerWidth)
                        .attr("height", mapContainerHeight)
                        .call(zoom);
    
    var map = mapContainer.append("g").attr("class", "map");
    
    function zoomed() {
        map.attr("transform", d3.event.transform);
    }
    
    var projection = d3.geoMercator().scale(SIZE*900).translate([SIZE*(-165),SIZE*1525]);
    var path = d3.geoPath().projection(projection);
    
    d3.json(typeFileName)
        .then(function(data) {
            if (typeFileName === "sweden-municipalities.json") {
                map.selectAll("path")
                    .data(topojson.feature(data, data.objects.kommuner).features)
                    .enter().append("path")
                    .attr("d", path);
            }

            if (typeFileName === "sweden-counties.json") {
                map.selectAll("path")
                    .data(topojson.feature(data, data.objects.SWE_adm1).features)
                    .enter().append("path")
                    .attr("d", path);
            }
            
        });

    d3.select("#map").append(() => swedenMap.node());
}