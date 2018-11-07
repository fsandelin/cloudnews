<template>
  <div id="main-section">
  <div id="mapDiv"><svg class="mapContainer"><g class="map"></g></svg></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson";

export default {
  name: "main-section",
  mounted: function() {
    this.newSwedenMap();
  },
  methods: {
    newSwedenMap: function(type) {
      const typeFileName =
        type === "municipalities"
          ? "src/assets/sweden-municipalities.json"
          : "src/assets/sweden-counties.json";
      const SIZE = 1.1;
      const RATIO = 2.1;
      const mapContainerWidth = SIZE * 230;
      const mapContainerHeight = mapContainerWidth * RATIO;

      const zoom = d3
        .zoom()
        .scaleExtent([0.5, 20])
        .on("zoom", zoomed);

      const mapContainer = d3
        .select(".mapContainer")
        .attr("width", mapContainerWidth)
        .attr("height", mapContainerHeight)
        .call(zoom);

      const map = d3.select(".map");

      function zoomed() {
        map.attr("transform", d3.event.transform);
      }

      const projection = d3
        .geoMercator()
        .scale(SIZE * 900)
        .translate([SIZE * -165, SIZE * 1525]);
      const path = d3.geoPath().projection(projection);

      d3.json(typeFileName).then(function(data) {
        if (typeFileName === "src/assets/sweden-municipalities.json") {
          map
            .selectAll("path")
            .data(topojson.feature(data, data.objects.kommuner).features)
            .enter()
            .append("path")
            .attr("d", path);
        }

        if (typeFileName === "src/assets/sweden-counties.json") {
          map
            .selectAll("path")
            .data(topojson.feature(data, data.objects.SWE_adm1).features)
            .enter()
            .append("path")
            .attr("d", path);
        }
      });
    }
  }
}
</script>

<style src="../styles/Main.scss" lang="scss" scoped></style>
