<template>
  <g id="cityLocations">
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { XYFromLatLong } from '../store/d3Zoom';

export default {
  name: "mapCities",
  computed: {
    ...mapGetters([
      'cities',
      'zoomValue'
    ])
  },
  methods: {
    XYFromLatLong: (latitude, longitude) => (XYFromLatLong(latitude, longitude))
  }
}
</script>

<style src="../styles/MapCities.scss" lang="scss" scoped></style>
