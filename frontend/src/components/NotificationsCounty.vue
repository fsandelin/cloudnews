<template>
  <g id="notificationsCounty">
    <circle
      class="county-circle"
      v-for="county of newsByCounty"
      v-bind:ref="'countyNewsNotification-'+county.name"
      v-bind:key="'countyNewsNotification-'+county.name"
      v-bind:cx="county.x+'px'"
      v-bind:cy="county.y+'px'"
      v-bind:stroke-width="strokeWidth()+'px'"
      v-bind:r="circleSize(county.news.length)+'px'">
    </circle>
    <text
      class="county-number"
      v-for="county of newsByCounty"
      v-bind:key="'countyNewsNotificationText'+county.name"
      text-anchor="middle"
      v-bind:x="county.x+'px'"
      v-bind:y="county.y+'px'"
      v-bind:dy="yOffset(county.news.length)+'px'"
      v-bind:font-size="fontSize(county.news.length)+'px'">
      {{county.news.length}}
    </text>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Velocity from "velocity-animate";

export default {
  name: "notificationsCounty",
  props: ['circleSize', 'fontSize', 'yOffset', 'calculateNewsLengthForObjects', 'updateNewsLengthForObjects'],
  computed: {
    ...mapGetters([
      'newsByCounty',
      'zoomValue'
    ])
  },
  data: function() {
    return {
      previousCountyNewsLength: []
    }
  },
  mounted: function() {
    this.previousCountyNewsLength = this.calculateNewsLengthForObjects(this.newsByCounty)
  },
  watch: {
    newsByCounty: function(newsByCounty) {
      this.updateNewsLengthForObjects(newsByCounty, this.previousCountyNewsLength, this.$refs, 'countyNewsNotification-')
    }
  },
  methods: {
    strokeWidth: function() {
      return 1.0 * (1/Math.max(this.zoomValue/2.5, 1.0));
    },
  }
}
</script>

<style src="../styles/NotificationsCounty.scss" lang="scss" scoped></style>
