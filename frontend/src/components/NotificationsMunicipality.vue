<template>
  <g id="notificationsMunicipality">
    <g
      v-for="municipality of newsByMunicipality"
      v-bind:key="'municipalityLine'+municipality.name">

      <!--LINES-->
      <transition-group tag="g"
        v-on:beforeEnter="(el, done) => lineBeforeEnter(el, done, municipality)"
        v-on:enter="(el, done) => lineEnter(el, done, municipality)"
        v-on:leave="(el, done) => lineLeave(el, done, municipality)"
        v-bind:css="false">
        <line
          v-bind:ref="'municipalityLine'+municipality.name"
          v-bind:key="'municipalityLine'+municipality.name"
          v-show="municipality.active"
          v-bind:x1="municipality.countyX+'px'"
          v-bind:y1="municipality.countyY+'px'"
          v-bind:x2="municipality.x+'px'"
          v-bind:y2="municipality.y+'px'"
          v-bind:stroke-width="lineWidth()+'px'">
        </line>
      </transition-group>

      <!--CIRCLES-->
      <transition-group tag="g"
        v-on:beforeEnter="(el, done) => circleBeforeEnter(el, done, municipality)"
        v-on:enter="(el, done) => circleEnter(el, done, municipality)"
        v-on:leave="(el, done) => circleLeave(el, done, municipality)"
        v-bind:css="false">
        <circle
          v-bind:ref="'newsNotification-'+municipality.name"
          v-bind:key="'newsNotification-'+municipality.name"
          v-show="municipality.active"
          class="municipality-circle"
          v-bind:cx="municipality.x+'px'"
          v-bind:cy="municipality.y+'px'"
          v-bind:r="circleSize(municipality.news.length)+'px'">
        </circle>
      </transition-group>

      <!--text-->
      <transition-group tag="g"
        v-on:beforeEnter="(el, done) => textBeforeEnter(el, done, municipality)"
        v-on:enter="(el, done) => textEnter(el, done, municipality)"
        v-on:leave="(el, done) => textLeave(el, done, municipality)"
        v-bind:css="false">
        <text
          v-bind:ref="'newsNotificationText-'+municipality.name+municipality.news.id"
          v-bind:key="'newsNotificationText-'+municipality.name+municipality.news.id"
          v-show="municipality.active"
          class="municipality-number"
          text-anchor="middle"
          v-bind:x="municipality.x+'px'"
          v-bind:y="municipality.y+'px'"
          v-bind:dy="yOffset(municipality.news.length)+'px'"
          v-bind:font-size="fontSize(municipality.news.length)+'px'">
          {{municipality.news.length}}
        </text>
      </transition-group>
    </g>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  newsSources as ns,
  getters as g,
  actions as a
} from '../store/constants'

export default {
  name: "notificationsMunicipality",
  props: ['circleSize', 'fontSize', 'yOffset'],
  computed: {
    ...mapGetters([
      g.SELECTED_COUNTY,
      g.NEWS_BY_MUNICIPALITY,
      g.ZOOM_VALUE
    ])
  },
  data: function() {
    return {
      previousmunicipalityNewsLength: []
    }
  },
  mounted: function() {
    this.previousMunicipalityNewsLength = this.newsByMunicipality.map((municipality) => ({ name: municipality.name, length: municipality.news.length }));
  },
  watch: {
    newsByMunicipality: function(newsByMunicipality) {
      for (const municipality of newsByMunicipality) {
        if (!(this.previousMunicipalityNewsLength.map((m)=>(m.name)).includes(municipality.name))){
          this.previousMunicipalityNewsLength.push({name: municipality.name, length: municipality.news.length});
        }

        this.previousMunicipalityNewsLength.map(previousMunicipality => {
          if (municipality.name === previousMunicipality.name && 
              municipality.news.length !== previousMunicipality.length) {
                this.animate(municipality.name);
                previousMunicipality.length = municipality.news.length;
              }
        });
      }
    }
  },
  methods: {
    lineWidth: function() {
      return 1.0 * (1/Math.max(this.zoomValue/2.5, 1.0));
    },
    animate: function(municipalityName) {
      let el = this.$refs['newsNotification-'+municipalityName];
      let r = parseFloat(el[0].attributes.getNamedItem("r").value, 10);
      Velocity(el,  { r: r*1.5}, { duration: 80 });
      Velocity(el,  { r: r }, { duration: 40 });
    },
    lineBeforeEnter: function(el, done, municipality) {
      Velocity(el, {x1: municipality.countyX, y1: municipality.countyY, x2: municipality.countyX, y2: municipality.countyY}, {duration: 0});
    },
    lineEnter: function(el, done, municipality) {
      Velocity(el, {x2: municipality.x, y2: municipality.y}, {duration: 300}, {complete: done});
    },
    lineLeave: function(el, done, municipality) {
      Velocity(el, {x1: municipality.countyX, y1: municipality.countyY, x2: municipality.countyX, y2: municipality.countyY}, {duration: 300}, {complete: done});
    },
    circleBeforeEnter: function(el, done, municipality) {
      Velocity(el, {cx: municipality.countyX, cy: municipality.countyY}, {duration: 0});
    },
    circleEnter: function(el, done, municipality) {
      Velocity(el, {cx: municipality.x, cy: municipality.y}, {duration: 300}, {complete: done});
    },
    circleLeave: function(el, done, municipality) {
      Velocity(el, {cx: municipality.countyX, cy: municipality.countyY}, {duration: 300}, {complete: done});
    },
    textBeforeEnter: function(el, done, municipality) {
      Velocity(el, {x: municipality.countyX, y: municipality.countyY}, {duration: 0});
    },
    textEnter: function(el, done, municipality) {
      Velocity(el, {x: municipality.x, y: municipality.y}, {duration: 300}, {complete: done});
    },
    textLeave: function(el, done, municipality) {
      Velocity(el, {x: municipality.countyX, y: municipality.countyY}, {duration: 300}, {complete: done});
    }    
  }
}
</script>

<style src="../styles/NotificationsMunicipality.scss" lang="scss" scoped></style>