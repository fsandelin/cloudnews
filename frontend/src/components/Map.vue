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
          v-bind:class="{ active: municipality.name === selectedMunicipality }"
          v-bind:key="municipality.key"
          v-show="municipality.active"
          v-bind:d="municipality.path"
          v-on:click="municipalityClick(municipality)">
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
      <mapCities>
      </mapCities>
      <notifications>
      </notifications>
    </g>
  </svg>
</template>

<script>
import d3 from '../store/d3Importer.js';
import Notifications from './Notifications'
import MapCities from './MapCities'
import { mapZoom, transitionToCounty, initialZoom } from '../store/d3Zoom';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "d3map",
  components: {
    'notifications': Notifications,
    'mapCities': MapCities
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
      'selectedMunicipality',
      'countyByName',
    ])
  },
  methods: {
    ...mapActions([
      'countyClick',
      'municipalityClick',
      'setZoomValue',
    ])
  }
}
</script>

<style src="../styles/Map.scss" lang="scss" scoped></style>
