<template>
  <div id="main-section">
    <d3map
      v-bind:newsList="newsList"
      v-bind:municipalities="municipalities"
      v-bind:counties="counties"
      v-bind:countries="countries"
      v-bind:countyClick="countyClick"
      v-bind:municipalityNews="municipalityNews"
      v-bind:addMunicipalityNews="addMunicipalityNews"
      v-bind:countyNews="countyNews"
      v-bind:addCountyNews="addCountyNews"
      v-bind:getMunicipalityByName="getMunicipalityByName"
    ></d3map>
  </div>
</template>

<script>
import Map from './Map'

export default {
  name: "mainsection",
  props: ['newsList', 'municipalities', 'getMunicipalityByName', 'countyClick', 'counties', 'countries', 'municipalityNews', 'countyNews', 'addMunicipalityNews', 'addCountyNews'],
  components: {
    'd3map': Map
  }
}
</script>

<style src="../styles/Main.scss" lang="scss" scoped></style>
