<template>
  <g id="notificationsCounty">
    <g
      v-for="county of newsByCounty"
      :key="'countyNotification-'+county.name"
      class="countyNotification"
      @click="countyClick(county)"
    >
      <circle
        :ref="'countyNewsNotification-'+county.name"
        :key="'countyNewsNotification-'+county.name"
        class="county-circle"
        :cx="county.x+'px'"
        :cy="county.y+'px'"
        :stroke-width="strokeWidth+'px'"
        :r="circleSize(county.news.length)+'px'"
      />
      <text
        :key="'countyNewsNotificationText'+county.name"
        class="county-number"
        text-anchor="middle"
        :x="county.x+'px'"
        :y="county.y+'px'"
        :dy="yOffset(county.news.length)+'px'"
        :font-size="fontSize(county.news.length)+'px'"
      >
        {{ county.news.length }}
      </text>
    </g>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'NotificationsCounty',
  props: ['circleSize', 'fontSize', 'yOffset', 'calculateNewsLengthForObjects', 'updateNewsLengthForObjects', 'strokeWidth'],
  data: function () {
    return {
      previousCountyNewsLength: []
    }
  },
  computed: {
    ...mapGetters([
      'newsByCounty',
      'zoomValue'
    ])
  },
  watch: {
    newsByCounty: function (newsByCounty) {
      this.updateNewsLengthForObjects(newsByCounty, this.previousCountyNewsLength, this.$refs, 'countyNewsNotification-')
    }
  },
  mounted: function () {
    this.previousCountyNewsLength = this.calculateNewsLengthForObjects(this.newsByCounty)
  },
  methods: {
    ...mapActions([
      'countyClick'
    ])
  }
}
</script>

<style src="../styles/NotificationsCounty.scss" lang="scss" scoped></style>
