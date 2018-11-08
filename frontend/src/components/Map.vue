<template>
  <svg class="mapContainer">
      <g class="map">
        <path
          class="municipality"
          v-bind:key="municipality.key"
          v-for="municipality in municipalities"
          v-bind:d="municipality.path">
        </path>
        <path
          class="county"
          v-bind:key="county.key"
          v-for="county in counties"
          v-bind:d="county.path">
        </path>
      </g>
    </svg>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson";
import municipalities from '../assets/sweden-municipalities.json';
import counties from '../assets/sweden-counties.json';

export default {
  name: "d3map",
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

    const countyFeatures = topojson.feature(counties, counties.objects.SWE_adm1).features;
    const municipalityFeatures = topojson.feature(municipalities, municipalities.objects.kommuner).features;

    for (let index in countyFeatures) {
      const countyFeature = countyFeatures[index];
      this.addCounty(index, path(countyFeature), countyFeature.properties.NAME_1);
    }
    for (let index in municipalityFeatures) {
      const municipalityFeature = municipalityFeatures[index];
      this.addMunicipality(index, path(municipalityFeature), municipalityFeature.properties.KNNAMN);
    }
  },
  methods: {
    addMunicipality: function(index, path, name) {
      this.municipalities.push({
        key: 'municipality-'+index,
        name: name,
        path: path
        });
    },
    addCounty: function(index, path, name) {
      this.counties.push({
        key: 'county-'+index,
        name: name,
        path: path
        })
    }
  }
}
</script>

<style src="../styles/Map.scss" lang="scss" scoped></style>
