<template>
  <svg class="mapContainer">
    <g class="map">
      <path
        class="country"
        v-for="country in countries"
        v-bind:key="country.key"
        v-bind:d="country.path">
      </path>
      <path
        class="municipality"
        v-for="municipality in this.municipalities"
        v-bind:key="municipality.key"
        v-show="municipality.active"
        v-bind:d="municipality.path">
      </path>
      <path
        class="county"
        v-for="county in counties"
        v-bind:key="county.key"
        v-show="county.active"
        v-bind:d="county.path"
        v-on:click="countyClick(county)">
      </path>
      <circle
        class="circle-municipality"
        v-for="[metaData, news] of municipalityNews"
        v-bind:key="'newsNotification'+metaData.municipality.name"
        v-bind:cx="metaData.county.active ? metaData.county.x : metaData.municipality.x +'px'"
        v-bind:cy="metaData.county.active ? metaData.county.y : metaData.municipality.y +'px'"
        v-bind:r="circleSize(news.length)+'px'">
      </circle>
      <circle
        class="circle-county"
        v-for="[metaData, news] of countyNews"
        v-bind:key="'countyNewsNotification'+metaData.county.name"
        v-show="metaData.county.active"
        v-bind:cx="metaData.county.x+'px'"
        v-bind:cy="metaData.county.y+'px'"
        v-bind:r="circleSize(news.length)+'px'">
      </circle>
      <transition-group name="fade" tag="g">
      <text
        class="circle-number"
        v-for="[metaData, news] of municipalityNews"
        v-bind:key="'newsNotificationText'+metaData.municipality.name+news.id"
        v-show="metaData.municipality.active"
        text-anchor="middle"
        v-bind:x="metaData.municipality.x+'px'"
        v-bind:y="metaData.municipality.y+'px'"
        v-bind:dy="yOffset(news.length)+'px'"
        v-bind:font-size="fontSize(news.length)+'px'">
        {{news.length}}
      </text>
      <text
        class="circle-number"
        v-for="[metaData, news] of countyNews"
        v-bind:key="'countyNewsNotificationText'+metaData.county.name"
        v-show="metaData.county.active"
        text-anchor="middle"
        v-bind:x="metaData.county.x+'px'"
        v-bind:y="metaData.county.y+'px'"
        v-bind:dy="yOffset(news.length)+'px'"
        v-bind:font-size="fontSize(news.length)+'px'">
        {{news.length}}
      </text>
      </transition-group>
    </g>
  </svg>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson";
import * as Velocity from "velocity-animate";

export default {
  name: "d3map",
  props: ['newsList', 'municipalities', 'getMunicipalityByName', 'countyClick', 'counties', 'countries', 'municipalityNews', 'countyNews', 'addMunicipalityNews', 'addCountyNews'],
  data () {
    return {
      cityNews: []
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
    d3.select(".mapContainer").call(zoom.translateTo, 490,255);
    d3.select(".mapContainer").call(zoom.scaleTo, 0.9*SIZE);

    this.calculateNewsList();
  },
  methods: {
    calculateNewsList: function() {
      for (const news of this.newsList) {
        const municipality = this.getMunicipalityByName(news.location.municipality);
        const county = this.getCountyByName(municipality.county);
        const newsMetaData = {
          municipality: municipality,
          county: county
        }

        this.addMunicipalityNews({ news, newsMetaData });
        this.addCountyNews({ news, newsMetaData })

      }
    },
    getCountyByName: function(name) {
      if (name === undefined) {
        return undefined;
      }

      for (const county of this.counties) {
        if(name.toLowerCase() === county.name) {
          return county;
        }
      }
    },
    circleSize: function(length) {
      return (4+(length/2));
    },
    fontSize: function(length) {
      return (4+(length/2));
    },
    yOffset: function(length) {
      return (4+(length/2))/3;
    },
  }
}
</script>

<style src="../styles/Map.scss" lang="scss" scoped></style>
