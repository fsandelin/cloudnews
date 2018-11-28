<template>
  <g id="cityLocations">
    <circle
        class="city"
        v-for="city in cities"
        v-if="city.population > 10000"
        v-bind:key="city.key"
        v-bind:cx="city.x+'px'"
        v-bind:cy="city.y+'px'"
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
