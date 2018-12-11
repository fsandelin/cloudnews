<template>
  <g id="cityLocations">
    <TransitionGroup
      name="fade"
      tag="g">
      <g
        v-for="city in mapCities"
        :key="city.name+'-'+city.municipality+'-'+city.county">
        <circle
          :key="'circle-'+city.name+'-'+city.municipality+'-'+city.county"
          class="city"
          :cx="city.x+'px'"
          :cy="city.y+'px'"
          :r="radius+'px'" />
        <text
          :key="'text-'+city.name+'-'+city.municipality+'-'+city.county"
          class="city"
          :x="city.x+'px'"
          :y="city.y+'px'"
          :dx="fontSize/2+'px'"
          :font-size="fontSize+'px'">
          {{ city.name }}
        </text>
      </g>
    </TransitionGroup>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MapCities',
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
    ])
  },
  watch: {
    zoomValue: function () {
      const zoom = this.zoomValue
      this.fontSize = Math.min(12, 12 / zoom)
      this.radius = Math.min(3, 4 / zoom)

      if (this.valueTransitionedIntoRange(0, 2, this.previousZoomValue, zoom)) {
        this.setActiveMapCitiesBasedOnPopulation(250000)
      } else if (this.valueTransitionedIntoRange(2, 3, this.previousZoomValue, zoom)) {
        this.setActiveMapCitiesBasedOnPopulation(150000)
      } else if (this.valueTransitionedIntoRange(3, 5, this.previousZoomValue, zoom)) {
        this.setActiveMapCitiesBasedOnPopulation(100000)
      } else if (this.valueTransitionedIntoRange(5, 8, this.previousZoomValue, zoom)) {
        this.setActiveMapCitiesBasedOnPopulation(30000)
      } else if (this.valueTransitionedIntoRange(8, 12, this.previousZoomValue, zoom)) {
        this.setActiveMapCitiesBasedOnPopulation(20000)
      } else if (this.valueTransitionedIntoRange(12, 24, this.previousZoomValue, zoom)) {
        this.setActiveMapCitiesBasedOnPopulation(10000)
      }

      this.previousZoomValue = zoom
    }
  },
  mounted: function () {
    this.setActiveMapCitiesBasedOnPopulation(250000)
  },
  methods: {
    ...mapActions([
      'setActiveMapCitiesBasedOnPopulation'
    ]),
    valueTransitionedIntoRange (rangeStart, rangeEnd, previousValue, newValue) {
      return (previousValue < rangeStart && newValue >= rangeStart) || (previousValue > rangeEnd && newValue <= rangeEnd)
    }
  }
}
</script>

<style src="../styles/MapCities.scss" lang="scss" scoped></style>
