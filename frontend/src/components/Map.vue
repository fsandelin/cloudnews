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
          v-on:click="countyMapClick(county)">
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
import { mapGetters, mapActions } from 'vuex';
import {
  getters as g,
  actions as a
} from '../store/constants'

export default {
  name: "d3map",
  components: {
    'notifications': Notifications
  },
  mounted: function() {
    const size = this.sizeOfCurrentWindow();

    d3.select(".mapContainer").call(this.mapZoom);
    d3.select(".mapContainer").call(this.mapZoom.translateTo, 600,255);
    d3.select(".mapContainer").call(this.mapZoom.scaleTo, 0.5*size);
    d3.select(".mapContainer").transition().duration(750).call(this.mapZoom.scaleTo, 0.9*size);
  },
  computed: {
    ...mapGetters([
      g.COUNTRIES,
      g.COUNTIES,
      g.MUNICIPALITIES,
      g.ZOOM_VALUE
    ])
  },
  data: function() {
    return {
      mapZoom: d3.zoom()
                .wheelDelta(() => {
                  let deltaY = d3.event.deltaY > 0 ? 125 : -125
                  return -deltaY * (1) / 500;
                })
                .scaleExtent([0.2, 50])
                .on("zoom", this.zoomed)
    }
  },
  methods: {
    zoomed: function() {
      d3.select(".map").attr("transform", d3.event.transform);
      
      if (d3.event.transform.k !== this.zoomValue) {
        this.setZoomValue(d3.event.transform.k);
      }
    },
    ...mapActions([
      a.COUNTY_CLICK,
      a.SET_ZOOM_VALUE
    ]),
    countyMapClick: function(county) {
      this.countyClick(county)
      this.transition(county.x, county.y);
    },
    sizeOfCurrentWindow() { 
      const ratio = 2.1;
      const width = d3.select("#main-section").node().getBoundingClientRect().width;
      const height = d3.select("#main-section").node().getBoundingClientRect().height;
      const size =
        width * ratio < height
          ? width/500
          : height/500;
      return size;
    },
    transition(x, y) {
      const size = this.sizeOfCurrentWindow()
      const newZoomValue = 3.0*size;
      const xOffset = (100*(size/newZoomValue))
      if (this.zoomValue < newZoomValue) {
        d3.select(".mapContainer").transition().duration(450).call(this.mapZoom.translateTo, x+ xOffset, y)
                                  .transition().duration(200).call(this.mapZoom.scaleTo, newZoomValue);
      }                     
    }
  }
}
</script>

<style src="../styles/Map.scss" lang="scss" scoped></style>
