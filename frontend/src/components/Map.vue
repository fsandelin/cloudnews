<template>
  <svg class="mapContainer">
      <g class="map">
        <path
          class="country"
          v-for="country in countries"
          v-bind:key="country.key"
          v-show="country.active"
          v-bind:d="country.path"
          v-bind:name="country.name"> 
        </path>
        <path
          class="municipality"
          v-for="municipality in municipalities"
          v-bind:key="municipality.key"
          v-show="municipality.active"
          v-bind:d="municipality.path"
          v-bind:name="municipality.name">
        </path>
        <path
          class="county"
          v-for="county in counties"
          v-bind:key="county.key"
          v-show="county.active"
          v-bind:d="county.path"
          v-bind:name="county.name"
          @mouseover="countyMouseover(county)">
        </path>
        <circle
          class="notification"
          v-bind:key="'notification'+newsItem.id"
          v-for="newsItem in newsList"
          v-bind:cx="getLocationOfName(newsItem.locationName).x+'px'"
          v-bind:cy="getLocationOfName(newsItem.locationName).y+'px'"
          v-bind:r="'6px'">
        </circle>
      </g>
    </svg>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson";
import swedishMunicipalities from '../assets/sweden-municipalities-meta-info.json';
import swedishCounties from '../assets/sweden-counties-meta-info.json';
import europeCountries from '../assets/europe-countries-meta-info.json';


export default {
  name: "d3map",
  props: ['newsList'],
  data () {
    return {
      countries: [],
      counties: [],
      municipalities: [],
      cities: []
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
      .scaleExtent([0.7, 20])
      .on("zoom", zoomed);

    d3.select(".mapContainer").call(zoom);

    swedishMunicipalities.map(x => x.active = true);
    this.municipalities = this.municipalities.concat(swedishMunicipalities);

    swedishCounties.map(x => x.active = true);
    this.counties = this.counties.concat(swedishCounties);
  
    europeCountries.map(x => x.active = true);
    this.countries = this.countries.concat(europeCountries);
  },
  methods: {
    countyMouseover: function(mouseoverCounty) {
      this.counties.map(county => county.active = !(county.name === mouseoverCounty.name));
    },
    getLocationOfName: function(name) {
      for (const county of this.counties) {
        if(name.toLowerCase() === county.name) {
          return {
            x: county.x,
            y: county.y
          };
        }
      }

      return {
        x: 0,
        y: 0
      }
    }
  }
}
</script>

<style src="../styles/Map.scss" lang="scss" scoped></style>
