<template>
  <div id="main-section">
    <svg class="mapContainer">
        <g class="map">
          <path class="municipality" v-for="municipality in municipalities" :d=municipality>
          </path>
          <path class="county" v-for="county in counties" :d=county>
          </path>
        </g>
      </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson";
import municipalities from '../assets/sweden-municipalities.json'
import counties from '../assets/sweden-counties.json'

export default {
  name: "mainsection",
  data () {
    return {
      municipalities: [],
      counties: []
    }
  },
  mounted: function() {
    const RATIO = 2.1;
    const width = d3.select("#main-section").node().getBoundingClientRect().width;
    const height = d3.select("#main-section").node().getBoundingClientRect().height;
    const SIZE =
        width * RATIO < height
          ? width/500
          : height/500;

    function zoomed() {
      d3.select(".map").attr("transform", d3.event.transform);
    }

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 20])
      .on("zoom", zoomed);

    d3.select(".mapContainer").call(zoom);

    const projection = d3.geoMercator()
      .scale(SIZE * 900)
      .translate([SIZE * -255 + width/2, (SIZE) * 1525]);

    const path = d3.geoPath().projection(projection);

    var countyFeatures = topojson.feature(counties, counties.objects.SWE_adm1).features;
    var municipalityFeatures = topojson.feature(municipalities, municipalities.objects.kommuner).features;

    for (var index in countyFeatures) {
      var countyFeature = countyFeatures[index];
      this.addCounty(path(countyFeature));
    }
    for (var index in municipalityFeatures) {
      var municipalityFeature = municipalityFeatures[index];
      this.addMunicipality(path(municipalityFeature));
    }
  },
  methods: {
    addMunicipality: function(municipality) {
      this.municipalities.push(municipality);
    },
    addCounty: function(county) {
      this.counties.push(county)
    }
  }
}
</script>

<style src="../styles/Main.scss" lang="scss" scoped></style>
