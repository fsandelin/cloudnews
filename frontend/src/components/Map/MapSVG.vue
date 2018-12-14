<template>
  <div id="map-svg-wrapper">
    <svg class="mapContainer">
      <g class="map">
        <g>
          <path
            v-for="country in countries"
            :key="country.key"
            class="country"
            :d="country.path" />
          <path
            v-for="municipality in municipalities"
            v-show="municipality.active"
            :key="municipality.key"
            class="municipality"
            :class="{ active: municipality.name === selectedMunicipality }"
            :d="municipality.path"
            @click="municipalityClick(municipality)" />
          <path
            v-for="county in counties"
            v-show="county.active"
            :key="county.key"
            class="county"
            :d="county.path"
            @click="countyClick(county)" />
        </g>
        <MapCities />
        <Notifications />
      </g>
    </svg>
  </div>
</template>

<script>
import d3 from '../../helpers/importerD3.js'
import { mapZoom, transitionToCounty, initialZoom } from '../../helpers/d3Zoom'
import Notifications from '../Notifications/Notifications'
import MapCities from './MapCities'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MapSVG',
  components: {
    'Notifications': Notifications,
    'MapCities': MapCities
  },
  data () {
    return {
      mapZoom: mapZoom(this.setZoomValue)
    }
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
      'countyByName'
    ])
  },
  mounted: function () {
    d3.select('.mapContainer').call(this.mapZoom).on('dblclick.zoom', () => transitionToCounty(this.mapZoom, (this.countyByName(this.selectedCounty))))
    initialZoom(this.mapZoom)
  },
  methods: {
    ...mapActions([
      'countyClick',
      'municipalityClick',
      'setZoomValue'
    ])
  }
}
</script>

<style src="./MapSVG.scss" lang="scss" scoped></style>
