<template>
  <g id="cityLocations">
    <transition-group name="fade" tag="g">
    <g
      v-for="city in mapCities"
      v-bind:key="city.name+'-'+city.municipality+'-'+city.county">
          <circle 
            v-bind:key="'circle-'+city.name+'-'+city.municipality+'-'+city.county"
            class="city"
            v-bind:cx="city.x+'px'"
            v-bind:cy="city.y+'px'"
            v-bind:r="radius+'px'">
          </circle>
          <text
            v-bind:key="'text-'+city.name+'-'+city.municipality+'-'+city.county"
            class="city"
            v-bind:x="city.x+'px'"
            v-bind:y="city.y+'px'"
            v-bind:dx="fontSize/2+'px'"
            v-bind:font-size="fontSize+'px'">
            {{city.name}}
          </text>
    </g>
    </transition-group>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "mapCities",
  data () {
    return {
      previousZoomValue: 0,
      fontSize: 0,
      radius: 0
    }
  },
  computed: {
    ...mapGetters([
      'mapCities',
      'zoomValue',
      'selectedCounty'
    ]),
  },
  mounted: function() {
    this.setActiveMapCitiesBasedOnPopulation(250000)
  },
  watch: {
    zoomValue: function() {
      const zoom = this.zoomValue;
      this.fontSize = Math.min(12, 12/zoom);
      this.radius = Math.min(3, 4/zoom);

      if (this.valueTransitionedIntoRange(0, 2, this.previousZoomValue, zoom)) {
        this.setActiveMapCitiesBasedOnPopulation(250000)
      } else if (this.valueTransitionedIntoRange(2, 3, this.previousZoomValue, zoom)) {
        this.setActiveMapCitiesBasedOnPopulation(150000)
      } else if (this.valueTransitionedIntoRange(3, 5, this.previousZoomValue, zoom)) {
        this.setActiveMapCitiesBasedOnPopulation(100000);
      } else if (this.valueTransitionedIntoRange(5, 8, this.previousZoomValue, zoom)) {
        this.setActiveMapCitiesBasedOnPopulation(30000);
      } else if (this.valueTransitionedIntoRange(8, 12, this.previousZoomValue, zoom)) {
        this.setActiveMapCitiesBasedOnPopulation(20000);
      } else if (this.valueTransitionedIntoRange(12, 24, this.previousZoomValue, zoom)) {
        this.setActiveMapCitiesBasedOnPopulation(10000);
      }

      this.previousZoomValue = zoom
    }
  },
  methods: {
    ...mapActions([
      'setActiveMapCitiesBasedOnPopulation',
    ]),
    valueTransitionedIntoRange(rangeStart, rangeEnd, previousValue, newValue) {
      return (previousValue < rangeStart && newValue >= rangeStart) || (previousValue > rangeEnd && newValue <= rangeEnd);
    },
  }
}
</script>

<style src="../styles/MapCities.scss" lang="scss" scoped></style>
