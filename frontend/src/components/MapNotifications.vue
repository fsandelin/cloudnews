<template>
  <g id="mapNotifications">
    <circle
      class="circle-municipality"
      v-for="[metaData, news] of municipalityNews"
      v-bind:key="'newsNotification'+metaData.municipality.name"
      v-bind:cx="metaData.county.active ? metaData.county.x : metaData.municipality.x +'px'"
      v-bind:cy="metaData.county.active ? metaData.county.y : metaData.municipality.y +'px'"
      v-bind:r="circleSize(news.length)+'px'">
    </circle>
    <circle
      class="circle-county"
      v-for="[metaData, news] of countyNews"
      v-bind:key="'countyNewsNotification'+metaData.county.name"
      v-show="metaData.county.active"
      v-bind:cx="metaData.county.x+'px'"
      v-bind:cy="metaData.county.y+'px'"
      v-bind:r="circleSize(news.length)+'px'">
    </circle>
    <transition-group name="fade" tag="g">
    <text
      class="circle-number"
      v-for="[metaData, news] of municipalityNews"
      v-bind:key="'newsNotificationText'+metaData.municipality.name+news.id"
      v-show="metaData.municipality.active"
      text-anchor="middle"
      v-bind:x="metaData.municipality.x+'px'"
      v-bind:y="metaData.municipality.y+'px'"
      v-bind:dy="yOffset(news.length)+'px'"
      v-bind:font-size="fontSize(news.length)+'px'">
      {{news.length}}
    </text>
    <text
      class="circle-number"
      v-for="[metaData, news] of countyNews"
      v-bind:key="'countyNewsNotificationText'+metaData.county.name"
      v-show="metaData.county.active"
      text-anchor="middle"
      v-bind:x="metaData.county.x+'px'"
      v-bind:y="metaData.county.y+'px'"
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
