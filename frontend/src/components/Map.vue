<template>
  <svg class="mapContainer">
    <g class="map">
      <g>
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
      </g>
      <notifications>
      </notifications>
    </g>
  </svg>
</template>

<script>
import * as d3 from "d3";
import panzoom from "panzoom";
import Notifications from './Notifications'
import { mapZoom, transitionToCounty, initialZoom } from '../store/d3Zoom';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "d3map",
  components: {
    'notifications': Notifications
  },
  data () {
    return {
      mapZoom: mapZoom(this.setZoomValue)
    }
  },
  mounted: function() {
    d3.select(".mapContainer").call(this.mapZoom).on("dblclick.zoom", () => transitionToCounty(this.mapZoom, (this.countyByName(this.selectedCounty))));
    initialZoom(this.mapZoom);
  },
  computed: {
    ...mapGetters([
      'countries',
      'counties',
      'municipalities',
      'zoomValue',
      'selectedCounty',
      'countyByName'
    ])
  },
  methods: {
    zoomed: function() {
      d3.select(".map").attr("transform", d3.event.transform);
      
      if (d3.event.transform.k !== this.zoomValue) {
        this.setZoomValue(d3.event.transform.k);
      }
    },
    ...mapActions([
      'countyClick',
      'setZoomValue',
    ])
  }
}
</script>

<style src="../styles/Map.scss" lang="scss" scoped></style>
