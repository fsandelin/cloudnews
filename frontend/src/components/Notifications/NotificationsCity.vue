<template>
  <g id="notificationsCity">
    <line
      :ref="'cityLine-'+city.name"
      :key="'cityLine-'+city.name"
      class="city-line"
      :x1="city.municipalityX+'px'"
      :y1="city.municipalityY+'px'"
      :x2="city.x+'px'"
      :y2="city.y+'px'"
      :stroke-width="lineWidth*0.70+'px'" />
    <circle
      :ref="'cityCircle-'+city.name"
      :key="'cityCircle-'+city.name"
      class="city-circle"
      :cx="city.x+'px'"
      :cy="city.y+'px'"
      :r="circleSize(city.news.length)*0.70+'px'" />
    <text
      :ref="'cityText-'+city.name"
      :key="'cityText-'+city.name"
      class="city-number"
      text-anchor="middle"
      :x="city.x+'px'"
      :y="city.y+'px'"
      :dy="yOffset(city.news.length)*0.70+'px'"
      :font-size="fontSize(city.news.length)*0.70+'px'">
      {{ city.news.length }}
    </text>
  </g>
</template>

<script>
import * as animations from '../../helpers/veloCityAnimate.js'

export default {
  name: 'NotificationsCity',
  props: ['circleSize', 'fontSize', 'yOffset', 'lineWidth', 'city'],
  mounted: function () {
    const line = this.$refs['cityLine-' + this.city.name]
    const circle = this.$refs['cityCircle-' + this.city.name]
    const text = this.$refs['cityText-' + this.city.name]

    animations.lineBeforeEnter(
      line,
      this.city.municipalityX,
      this.city.municipalityY,
      this.city.municipalityX,
      this.city.municipalityY)
    animations.lineEnter(line, this.city.x, this.city.y)
    animations.circleBeforeEnter(circle, this.city.municipalityX, this.city.municipalityY)
    animations.circleEnter(circle, this.city.x, this.city.y)
    animations.textBeforeEnter(text, this.city.municipalityX, this.city.municipalityY)
    animations.textEnter(text, this.city.x, this.city.y)
  },
  beforeDestroyed: function () {
    const line = this.$refs['cityLine-' + this.city.name]
    const circle = this.$refs['cityCircle-' + this.city.name]
    const text = this.$refs['cityText-' + this.city.name]

    animations.lineLeave(
      line,
      this.city.municipalityX,
      this.city.municipalityY,
      this.city.municipalityX,
      this.city.municipalityY)
    animations.circleLeave(circle, this.city.municipalityX, this.city.municipalityY)
    animations.textLeave(text, this.city.municipalityX, this.city.municipalityY)
  }
}
</script>

<style src="./NotificationsCity.scss" lang="scss" scoped></style>
