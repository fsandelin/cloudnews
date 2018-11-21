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
import {
  newsSources as ns,
  getters as g,
  actions as a
} from '../store/constants'

export default {
  name: "notificationsCounty",
  props: ['circleSize', 'fontSize', 'yOffset'],
  computed: {
    ...mapGetters([
      g.NEWS_BY_COUNTY,
      g.ZOOM_VALUE
    ])
  },
  data: function() {
    return {
      previousCountyNewsLength: []
    }
  },
  mounted: function() {
    this.previousCountyNewsLength = this.newsByCounty.map((county) => ({ name: county.name, length: county.news.length }));
  },
  watch: {
    newsByCounty: function(newsByCounty) {
      console.log("triggered");
      for (const county of newsByCounty) {
        if (!(this.previousCountyNewsLength.map((c)=>(c.name)).includes(county.name))){
          this.previousCountyNewsLength.push({name: county.name, length: county.news.length});
        }

        for(let previousCounty of this.previousCountyNewsLength) {
          if (county.name === previousCounty.name && county.news.length !== previousCounty.length) {
            this.animate(county.name);
            previousCounty.length = county.news.length;
          }
        }
      }
    }
  },
  methods: {
    strokeWidth: function() {
      return 1.0 * (1/Math.max(this.zoomValue/2.5, 1.0));
    },
    animate: function(countyName) {
      let el = this.$refs['countyNewsNotification-'+countyName];
      let r = parseFloat(el[0].attributes[4].value, 10);
      Velocity(el,  { r: r*1.5}, { duration: 80 });
      Velocity(el,  { r: r }, { duration: 40 });
    }
  }
}
</script>

<style src="../styles/NotificationsCounty.scss" lang="scss" scoped></style>