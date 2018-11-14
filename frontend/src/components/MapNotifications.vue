<template>
  <g id="mapNotifications">
    <circle
      class="circle-municipality"
      v-for="{municipality, county, news} of municipalityNews"
      v-bind:key="'newsNotification'+municipality.name"
      v-bind:cx="county.active ? county.x : municipality.x +'px'"
      v-bind:cy="county.active ? county.y : municipality.y +'px'"
      v-bind:r="circleSize(news.length)+'px'">
    </circle>
    <circle
      class="circle-county"
      v-for="{county, news} of countyNews"
      v-bind:key="'countyNewsNotification'+county.name"
      v-show="county.active"
      v-bind:cx="county.x+'px'"
      v-bind:cy="county.y+'px'"
      v-bind:r="circleSize(news.length)+'px'">
    </circle>
    <transition-group name="fade" tag="g">
    <text
      class="circle-number"
      v-for="{municipality, news} of municipalityNews"
      v-bind:key="'newsNotificationText'+municipality.name+news.id"
      v-show="municipality.active"
      text-anchor="middle"
      v-bind:x="municipality.x+'px'"
      v-bind:y="municipality.y+'px'"
      v-bind:dy="yOffset(news.length)+'px'"
      v-bind:font-size="fontSize(news.length)+'px'">
      {{news.length}}
    </text>
    <text
      class="circle-number"
      v-for="{county, news} of countyNews"
      v-bind:key="'countyNewsNotificationText'+county.name"
      v-show="county.active"
      text-anchor="middle"
      v-bind:x="county.x+'px'"
      v-bind:y="county.y+'px'"
      v-bind:dy="yOffset(news.length)+'px'"
      v-bind:font-size="fontSize(news.length)+'px'">
      {{news.length}}
    </text>
    </transition-group>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "mapNotifications",
  computed: {
    ...mapGetters([
      'countyNews',
      'municipalityNews'
    ])
  },
  methods: {
    circleSize: function(length) {
      return (4+(length/2));
    },
    fontSize: function(length) {
      return (4+(length/2));
    },
    yOffset: function(length) {
      return (4+(length/2))/3;
    }
  }
}
</script>

<style src="../styles/MapNotifications.scss" lang="scss" scoped></style>
