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
        <circle
          class="city"
          v-for="city in cities"
          v-bind:key="city.key"
          v-show="city.active"
          v-bind:cx="XYFromLatLong(city.latitude, city.longitude)[0]+'px'"
          v-bind:cy="XYFromLatLong(city.latitude, city.longitude)[1]+'px'"
          v-bind:r="1+'px'">
        </circle>
      </g>
      <notifications>
      </notifications>
    </g>
  </svg>
</template>

<script>
import * as d3 from "d3";
import Notifications from './Notifications'
import { mapZoom, transitionToCounty, initialZoom, sizeOfCurrentWindow, XYFromLatLong} from '../store/d3Zoom';
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
      'cities',
      'zoomValue',
      'selectedCounty',
      'countyByName',
    ])
  },
  methods: {
    ...mapActions([
      'countyClick',
      'setZoomValue',
    ]),
    XYFromLatLong: (latitude, longitude) => (XYFromLatLong(latitude, longitude))
  }
}
</script>

<style src="../styles/Map.scss" lang="scss" scoped></style>
