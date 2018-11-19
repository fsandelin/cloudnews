<template>
  <g id="notificationsCounty">
    <circle
      class="circle-county"
      v-for="county of newsByCounty"
      v-bind:key="'countyNewsNotification'+county.name"
      v-show="county.active"
      v-bind:cx="county.x+'px'"
      v-bind:cy="county.y+'px'"
      v-bind:r="circleSize(county.news.length)+'px'">
    </circle>
    <transition-group name="fade" tag="g">
      <text
        class="circle-number"
        v-for="county of newsByCounty"
        v-bind:key="'countyNewsNotificationText'+county.name"
        v-show="county.active"
        text-anchor="middle"
        v-bind:x="county.x+'px'"
        v-bind:y="county.y+'px'"
        v-bind:dy="yOffset(county.news.length)+'px'"
        v-bind:font-size="fontSize(county.news.length)+'px'">
        {{county.news.length}}
      </text>
    </transition-group>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "notificationsCounty",
  props: ['circleSize', 'fontSize', 'yOffset'],
  computed: {
    ...mapGetters([
      'selectedCounty',
      'newsByCounty'
    ])
  },
}
</script>

<style src="../styles/MapNotifications.scss" lang="scss" scoped></style>