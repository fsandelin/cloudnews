<template>
  <g id="notificationsMunicipality">
    <g
      v-for="municipality of newsByMunicipality"
      v-bind:key="'municipalityNoticication-'+municipality.name">
      <!--LINES-->
      <transition
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
      </transition>

      <!--CIRCLES-->
      <transition
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
      </transition>

      <!--TEXT-->
      <transition
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
      </transition>
    </g>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "notificationsMunicipality",
  props: ['circleSize', 'fontSize', 'yOffset', 'calculateNewsLengthForObjects', 'updateNewsLengthForObjects', 'lineWidth'],
  computed: {
    ...mapGetters([
      'selectedCounty',
      'newsByMunicipality',
      'zoomValue'
    ])
  },
  data: function() {
    return {
      previousmunicipalityNewsLength: []
    }
  },
  mounted: function() {
    this.previousMunicipalityNewsLength = this.calculateNewsLengthForObjects(this.newsByMunicipality)
  },
  watch: {
    newsByMunicipality: function(newsByMunicipality) {
      this.updateNewsLengthForObjects(newsByMunicipality, this.previousMunicipalityNewsLength, this.$refs, 'newsNotification-')
    }
  },
  methods: {
    lineBeforeEnter: function(el, done, municipality) {
      Velocity(el, {
        x1: municipality.countyX,
        y1: municipality.countyY,
        x2: municipality.countyX,
        y2: municipality.countyY },
        { duration: 0 });
    },
    lineEnter: function(el, done, municipality) {
      Velocity(el, {
        x2: municipality.x,
        y2: municipality.y },
        { duration: 300 },
        { complete: done });
    },
    lineLeave: function(el, done, municipality) {
      Velocity(el, {
        x1: municipality.countyX,
        y1: municipality.countyY,
        x2: municipality.countyX,
        y2: municipality.countyY },
        { duration: 300 },
        { complete: done });
    },
    circleBeforeEnter: function(el, done, municipality) {
      Velocity(el, {
        cx: municipality.countyX,
        cy: municipality.countyY },
        { duration: 0 });
    },
    circleEnter: function(el, done, municipality) {
      Velocity(el, {
        cx: municipality.x,
        cy: municipality.y },
        { duration: 300 },
        { complete: done });
    },
    circleLeave: function(el, done, municipality) {
      Velocity(el, {
        cx: municipality.countyX,
        cy: municipality.countyY },
        { duration: 300 },
        { complete: done });
    },
    textBeforeEnter: function(el, done, municipality) {
      Velocity(el, {
        x: municipality.countyX,
        y: municipality.countyY },
        { duration: 0 });
    },
    textEnter: function(el, done, municipality) {
      Velocity(el, {
        x: municipality.x,
        y: municipality.y },
        { duration: 300 },
        { complete: done });
    },
    textLeave: function(el, done, municipality) {
      Velocity(el, {
        x: municipality.countyX,
        y: municipality.countyY },
        { duration: 300 },
        { complete: done });
    }
  }
}
</script>

<style src="../styles/NotificationsMunicipality.scss" lang="scss" scoped></style>
