<template>
  <g id="notificationsMunicipality">
    <g
      v-for="municipality of newsByMunicipality"
      :key="'municipalityNoticication-'+municipality.name"
      class="municipalityNoticication"
      @click="municipalityClick(municipality)">
      <!--LINES-->
      <Transition
        :css="false"
        @beforeEnter="(el, done) => lineBeforeEnter(el, done, municipality)"
        @enter="(el, done) => lineEnter(el, done, municipality)"
        @leave="(el, done) => lineLeave(el, done, municipality)">
        <line
          v-show="municipality.active"
          :ref="'municipalityLine'+municipality.name"
          :key="'municipalityLine'+municipality.name"
          :x1="municipality.countyX+'px'"
          :y1="municipality.countyY+'px'"
          :x2="municipality.x+'px'"
          :y2="municipality.y+'px'"
          :stroke-width="lineWidth+'px'" />
      </Transition>

      <!--CIRCLES-->
      <Transition
        :css="false"
        @beforeEnter="(el, done) => circleBeforeEnter(el, done, municipality)"
        @enter="(el, done) => circleEnter(el, done, municipality)"
        @leave="(el, done) => circleLeave(el, done, municipality)">
        <circle
          v-show="municipality.active"
          :ref="'newsNotification-'+municipality.name"
          :key="'newsNotification-'+municipality.name"
          class="municipality-circle"
          :cx="municipality.x+'px'"
          :cy="municipality.y+'px'"
          :r="circleSize(municipality.news.length)+'px'" />
      </Transition>

      <!--TEXT-->
      <Transition
        :css="false"
        @beforeEnter="(el, done) => textBeforeEnter(el, done, municipality)"
        @enter="(el, done) => textEnter(el, done, municipality)"
        @leave="(el, done) => textLeave(el, done, municipality)">
        <text
          v-show="municipality.active"
          :ref="'newsNotificationText-'+municipality.name+municipality.news.id"
          :key="'newsNotificationText-'+municipality.name+municipality.news.id"
          class="municipality-number"
          text-anchor="middle"
          :x="municipality.x+'px'"
          :y="municipality.y+'px'"
          :dy="yOffset(municipality.news.length)+'px'"
          :font-size="fontSize(municipality.news.length)+'px'">
          {{ municipality.news.length }}
        </text>
      </Transition>
    </g>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Velocity from 'velocity-animate'

export default {
  name: 'NotificationsMunicipality',
  props: ['circleSize', 'fontSize', 'yOffset', 'calculateNewsLengthForObjects', 'updateNewsLengthForObjects', 'lineWidth'],
  data: function () {
    return {
      previousMunicipalityNewsLength: []
    }
  },
  computed: {
    ...mapGetters([
      'selectedCounty',
      'newsByMunicipality',
      'zoomValue'
    ])
  },
  watch: {
    newsByMunicipality: function (newsByMunicipality) {
      this.updateNewsLengthForObjects(newsByMunicipality, this.previousMunicipalityNewsLength, this.$refs, 'newsNotification-')
    }
  },
  mounted: function () {
    this.previousMunicipalityNewsLength = this.calculateNewsLengthForObjects(this.newsByMunicipality)
  },
  methods: {
    ...mapActions([
      'municipalityClick'
    ]),
    lineBeforeEnter: function (el, done, municipality) {
      Velocity(el, {
        x1: municipality.countyX,
        y1: municipality.countyY,
        x2: municipality.countyX,
        y2: municipality.countyY },
      { duration: 0 })
    },
    lineEnter: function (el, done, municipality) {
      Velocity(el, {
        x2: municipality.x,
        y2: municipality.y },
      { duration: 300 },
      { complete: done })
    },
    lineLeave: function (el, done, municipality) {
      Velocity(el, {
        x1: municipality.countyX,
        y1: municipality.countyY,
        x2: municipality.countyX,
        y2: municipality.countyY },
      { duration: 300 },
      { complete: done })
    },
    circleBeforeEnter: function (el, done, municipality) {
      Velocity(el, {
        cx: municipality.countyX,
        cy: municipality.countyY },
      { duration: 0 })
    },
    circleEnter: function (el, done, municipality) {
      Velocity(el, {
        cx: municipality.x,
        cy: municipality.y },
      { duration: 300 },
      { complete: done })
    },
    circleLeave: function (el, done, municipality) {
      Velocity(el, {
        cx: municipality.countyX,
        cy: municipality.countyY },
      { duration: 300 },
      { complete: done })
    },
    textBeforeEnter: function (el, done, municipality) {
      Velocity(el, {
        x: municipality.countyX,
        y: municipality.countyY },
      { duration: 0 })
    },
    textEnter: function (el, done, municipality) {
      Velocity(el, {
        x: municipality.x,
        y: municipality.y },
      { duration: 300 },
      { complete: done })
    },
    textLeave: function (el, done, municipality) {
      Velocity(el, {
        x: municipality.countyX,
        y: municipality.countyY },
      { duration: 300 },
      { complete: done })
    }
  }
}
</script>

<style src="../styles/NotificationsMunicipality.scss" lang="scss" scoped></style>
