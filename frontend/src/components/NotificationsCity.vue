<template>
  <g id="notificationsCity">
    <g
      v-for="city of newsByCity"
      :key="city.name+'-'+city.municipality+'-'+city.county"
      class="cityNotification"
      @click="cityClick(city)">
      <!--LINES-->
      <Transition
        :css="false"
        @beforeEnter="(el, done) => lineBeforeEnter(el, done, city)"
        @enter="(el, done) => lineEnter(el, done, city)"
        @leave="(el, done) => lineLeave(el, done, city)">
        <line
          v-show="city.active"
          :ref="'cityLine'+city.name"
          :key="'cityLine'+'-'+city.name+'-'+city.municipality+'-'+city.county"
          :x1="city.municipalityX+'px'"
          :y1="city.municipalityY+'px'"
          :x2="city.x+'px'"
          :y2="city.y+'px'"
          :stroke-width="lineWidth*0.70+'px'" />
      </Transition>

      <!--CIRCLES-->
      <Transition
        :css="false"
        @beforeEnter="(el, done) => circleBeforeEnter(el, done, city)"
        @enter="(el, done) => circleEnter(el, done, city)"
        @leave="(el, done) => circleLeave(el, done, city)">
        <circle
          v-show="city.active"
          :ref="'newsNotification-'+city.name"
          :key="'newsNotification'+'-'+city.name+'-'+city.municipality+'-'+city.county"
          class="city-circle"
          :cx="city.x+'px'"
          :cy="city.y+'px'"
          :r="circleSize(city.news.length)*0.70+'px'" />
      </Transition>

      <!--TEXT-->
      <Transition
        :css="false"
        @beforeEnter="(el, done) => textBeforeEnter(el, done, city)"
        @enter="(el, done) => textEnter(el, done, city)"
        @leave="(el, done) => textLeave(el, done, city)">
        <text
          v-show="city.active"
          :ref="'newsNotificationText-'+city.name+city.news.id"
          :key="'newsNotificationText-'+city.name+city.news.id"
          class="city-number"
          text-anchor="middle"
          :x="city.x+'px'"
          :y="city.y+'px'"
          :dy="yOffset(city.news.length)*0.70+'px'"
          :font-size="fontSize(city.news.length)*0.70+'px'">
          {{ city.news.length }}
        </text>
      </Transition>
    </g>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Velocity from 'velocity-animate'

export default {
  name: 'NotificationsCity',
  props: ['circleSize', 'fontSize', 'yOffset', 'lineWidth'],
  computed: {
    ...mapGetters([
      'newsByCity'
    ])
  },
  methods: {
    ...mapActions([
      'cityClick'
    ]),
    lineBeforeEnter: function (el, done, city) {
      Velocity(el, {
        x1: city.municipalityX,
        y1: city.municipalityY,
        x2: city.municipalityX,
        y2: city.municipalityY,
        opacity: 1 },
      { duration: 0 })
    },
    lineEnter: function (el, done, city) {
      Velocity(el, {
        x2: city.x,
        y2: city.y },
      { duration: 300 },
      { complete: done })
    },
    lineLeave: function (el, done, city) {
      Velocity(el, {
        x1: city.municipalityX,
        y1: city.municipalityY,
        x2: city.municipalityX,
        y2: city.municipalityY,
        opacity: 0 },
      { duration: 300 },
      { complete: done })
    },
    circleBeforeEnter: function (el, done, city) {
      Velocity(el, {
        cx: city.municipalityX,
        cy: city.municipalityY,
        opacity: 1 },
      { duration: 0 })
    },
    circleEnter: function (el, done, city) {
      Velocity(el, {
        cx: city.x,
        cy: city.y },
      { duration: 300 },
      { complete: done })
    },
    circleLeave: function (el, done, city) {
      Velocity(el, {
        cx: city.municipalityX,
        cy: city.municipalityY,
        opacity: 0 },
      { duration: 300 },
      { complete: done })
    },
    textBeforeEnter: function (el, done, city) {
      Velocity(el, {
        x: city.municipalityX,
        y: city.municipalityY,
        opacity: 1 },
      { duration: 0 })
    },
    textEnter: function (el, done, city) {
      Velocity(el, {
        x: city.x,
        y: city.y },
      { duration: 300 },
      { complete: done })
    },
    textLeave: function (el, done, city) {
      Velocity(el, {
        x: city.municipalityX,
        y: city.municipalityY,
        opacity: 0 },
      { duration: 300 },
      { complete: done })
    }
  }
}
</script>

<style src="../styles/NotificationsCity.scss" lang="scss" scoped></style>
