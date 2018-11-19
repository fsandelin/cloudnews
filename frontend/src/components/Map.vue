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
      <mapNotifications>
      </mapNotifications>
    </g>
  </svg>
</template>

<script>
import * as d3 from "d3";
import MapNotifications from './MapNotifications'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "d3map",
  components: {
    'mapNotifications': MapNotifications
  },
  mounted: function() {
    const RATIO = 2.1;
    const width = d3.select("#main-section").node().getBoundingClientRect().width;
    const height = d3.select("#main-section").node().getBoundingClientRect().height;
    const SIZE =
        width * RATIO < height
          ? width/500
          : height/500;

    
    const zoomed = () => {
      d3.select(".map").attr("transform", d3.event.transform);
      if (d3.event.transform.k !== this.getZoomValue) {
        this.setZoomValue(d3.event.transform.k);
      }
    }

    const zoom = d3
      .zoom()
      .scaleExtent([0.7, 50])
      .on("zoom", zoomed);

    d3.select(".mapContainer").call(zoom);
    d3.select(".mapContainer").call(zoom.translateTo, 600,255);
    d3.select(".mapContainer").call(zoom.scaleTo, 0.9*SIZE);

  },
  computed: {
    ...mapGetters([
      'countries',
      'counties',
      'municipalities',
      'getZoomValue'
    ])
  },
  methods: {
    ...mapActions([
      'countyClick',
      'setZoomValue'
    ])
  }
}
</script>

<style src="../styles/Map.scss" lang="scss" scoped></style>
