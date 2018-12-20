<template>
  <g
    id="notificationsCounty"
    @click="countyClick(county)">
    <circle
      :ref="'countyCircle-'+county.name"
      :key="'countyCircle-'+county.name"
      class="county-circle"
      :cx="county.x+'px'"
      :cy="county.y+'px'"
      :stroke-width="strokeWidth+'px'"
      :r="circleSize(county.news.length)+'px'" />
    <text
      :ref="'countyText-'+county.name"
      :key="'countyText-'+county.name"
      class="county-number"
      text-anchor="middle"
      :x="county.x+'px'"
      :y="county.y+'px'"
      :dy="yOffset(county.news.length)+'px'"
      :font-size="fontSize(county.news.length)+'px'">
      {{ county.news.length }}
    </text>
  </g>
</template>

<script>
import * as animations from '../../helpers/velocityAnimate.js'
import { mapActions } from 'vuex'
export default {
  name: 'NotificationsCounty',
  props: {
    'county': {
      type: Object,
      required: true
    },
    'strokeWidth': {
      type: Number,
      required: true
    },
    'circleSize': {
      type: Function,
      required: true
    },
    'fontSize': {
      type: Function,
      required: true
    },
    'yOffset': {
      type: Function,
      required: true
    }
  },
  computed: {
    size: function () {
      return this.county.news.length
    }
  },
  watch: {
    size: function () {
      const circle = this.$refs['countyCircle-' + this.county.name]
      animations.blobAnimateCircle(circle)
    }
  },
  methods: {
    ...mapActions([
      'countyClick'
    ])
  }
}
</script>

<style src="./NotificationsCounty.scss" lang="scss" scoped></style>
