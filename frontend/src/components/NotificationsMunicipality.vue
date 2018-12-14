<template>
  <g id="notificationsMunicipality">
    <line
      v-show="municipality.active"
      :ref="'municipalityLine-'+municipality.name"
      :key="'municipalityLine-'+municipality.name"
      class="municipality-line"
      :x1="municipality.countyX+'px'"
      :y1="municipality.countyY+'px'"
      :x2="municipality.x+'px'"
      :y2="municipality.y+'px'"
      :stroke-width="lineWidth+'px'" />
    <circle
      v-show="municipality.active"
      :ref="'municipalityCircle-'+municipality.name"
      :key="'municipalityCircle-'+municipality.name"
      class="municipality-circle"
      :cx="municipality.x+'px'"
      :cy="municipality.y+'px'"
      :r="circleSize(municipality.news.length)+'px'" />
    <text
      v-show="municipality.active"
      :ref="'municipalityText-'+municipality.name"
      :key="'municipalityText-'+municipality.name"
      class="municipality-number"
      text-anchor="middle"
      :x="municipality.x+'px'"
      :y="municipality.y+'px'"
      :dy="yOffset(municipality.news.length)+'px'"
      :font-size="fontSize(municipality.news.length)+'px'">
      {{ municipality.news.length }}
    </text>
  </g>
</template>

<script>
import * as animations from '../store/veloCityAnimate.js'

export default {
  name: 'NotificationsMunicipality',
  props: ['circleSize', 'fontSize', 'yOffset', 'lineWidth', 'municipality'],
  mounted: function () {
    const line = this.$refs['municipalityLine-' + this.municipality.name]
    const circle = this.$refs['municipalityCircle-' + this.municipality.name]
    const text = this.$refs['municipalityText-' + this.municipality.name]

    animations.lineBeforeEnter(line, this.municipality.countyX, this.municipality.countyY, this.municipality.countyX, this.municipality.countyY)
    animations.lineEnter(line, this.municipality.x, this.municipality.y)
    animations.circleBeforeEnter(circle, this.municipality.countyX, this.municipality.countyY)
    animations.circleEnter(circle, this.municipality.x, this.municipality.y)
    animations.textBeforeEnter(text, this.municipality.countyX, this.municipality.countyY)
    animations.textEnter(text, this.municipality.x, this.municipality.y)
  },
  beforeDestroyed: function () {
    const line = this.$refs['municipalityLine-' + this.municipality.name]
    const circle = this.$refs['municipalityCircle-' + this.municipality.name]
    const text = this.$refs['municipalityText-' + this.municipality.name]

    animations.lineLeave(line, this.municipality.countyX, this.municipality.countyY, this.municipality.countyX, this.municipality.countyY)
    animations.circleLeave(circle, this.municipality.countyX, this.municipality.countyY)
    animations.textLeave(text, this.municipality.countyX, this.municipality.countyY)
  }
}
</script>

<style src="../styles/NotificationsMunicipality.scss" lang="scss" scoped></style>
