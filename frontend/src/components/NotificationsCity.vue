<template>
  <g id="notificationsCity">
    <g
      v-for="city of newsByCity"
      v-bind:key="'cityNotifications-'+city.name">
      <!--LINES-->
      <transition
        v-on:beforeEnter="(el, done) => lineBeforeEnter(el, done, city)"
        v-on:enter="(el, done) => lineEnter(el, done, city)"
        v-on:leave="(el, done) => lineLeave(el, done, city)"
        v-bind:css="false">
        <line
          v-bind:ref="'cityLine'+city.name"
          v-bind:key="'cityLine'+city.name"
          v-show="city.active"
          v-bind:x1="city.municipalityX+'px'"
          v-bind:y1="city.municipalityY+'px'"
          v-bind:x2="city.x+'px'"
          v-bind:y2="city.y+'px'"
          v-bind:stroke-width="lineWidth()*0.70+'px'">
        </line>
      </transition>

      <!--CIRCLES-->
      <transition
        v-on:beforeEnter="(el, done) => circleBeforeEnter(el, done, city)"
        v-on:enter="(el, done) => circleEnter(el, done, city)"
        v-on:leave="(el, done) => circleLeave(el, done, city)"
        v-bind:css="false">
        <circle
          v-bind:ref="'newsNotification-'+city.name"
          v-bind:key="'newsNotification-'+city.name"
          v-show="city.active"
          class="city-circle"
          v-bind:cx="city.x+'px'"
          v-bind:cy="city.y+'px'"
          v-bind:r="circleSize(city.news.length)*0.70+'px'">
        </circle>
      </transition>

      <!--TEXT-->
      <transition
        v-on:beforeEnter="(el, done) => textBeforeEnter(el, done, city)"
        v-on:enter="(el, done) => textEnter(el, done, city)"
        v-on:leave="(el, done) => textLeave(el, done, city)"
        v-bind:css="false">
        <text
          v-bind:ref="'newsNotificationText-'+city.name+city.news.id"
          v-bind:key="'newsNotificationText-'+city.name+city.news.id"
          v-show="city.active"
          class="city-number"
          text-anchor="middle"
          v-bind:x="city.x+'px'"
          v-bind:y="city.y+'px'"
          v-bind:dy="yOffset(city.news.length)*0.70+'px'"
          v-bind:font-size="fontSize(city.news.length)*0.70+'px'">
          {{city.news.length}}
        </text>
      </transition>
    </g>
  </g>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "notificationsCity",
  props: ['circleSize', 'fontSize', 'yOffset', 'lineWidth'],
  computed: {
    ...mapGetters([
      'newsByCity',
    ])
  },
  methods: {
    lineBeforeEnter: function(el, done, city) {
      Velocity(el, {
        x1: city.municipalityX,
        y1: city.municipalityY,
        x2: city.municipalityX,
        y2: city.municipalityY,
        opacity: 1 },
        { duration: 0 });
    },
    lineEnter: function(el, done, city) {
      Velocity(el, {
        x2: city.x,
        y2: city.y },
        { duration: 300 },
        { complete: done });
    },
    lineLeave: function(el, done, city) {
      Velocity(el, {
        x1: city.municipalityX,
        y1: city.municipalityY,
        x2: city.municipalityX,
        y2: city.municipalityY,
        opacity: 0},
        { duration: 300 },
        { complete: done });
    },
     circleBeforeEnter: function(el, done, city) {
      Velocity(el, {
        cx: city.municipalityX,
        cy: city.municipalityY,
        opacity: 1 },
        { duration: 0 });
    },
    circleEnter: function(el, done, city) {
      Velocity(el, {
        cx: city.x,
        cy: city.y },
        { duration: 300 },
        { complete: done });
    },
    circleLeave: function(el, done, city) {
      Velocity(el, {
        cx: city.municipalityX,
        cy: city.municipalityY,
        opacity: 0},
        { duration: 300 },
        { complete: done });
    },
    textBeforeEnter: function(el, done, city) {
      Velocity(el, {
        x: city.municipalityX,
        y: city.municipalityY,
        opacity: 1 },
        { duration: 0 });
    },
    textEnter: function(el, done, city) {
      Velocity(el, {
        x: city.x,
        y: city.y },
        { duration: 300 },
        { complete: done });
    },
    textLeave: function(el, done, city) {
      Velocity(el, {
        x: city.municipalityX,
        y: city.municipalityY,
        opacity: 0},
        { duration: 300 },
        { complete: done });
    }
  }
}
</script>

<style src="../styles/NotificationsCity.scss" lang="scss" scoped></style>