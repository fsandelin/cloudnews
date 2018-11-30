<template>
  <li
    @mouseenter="toggleHover(news)"
    @mouseleave="toggleHover(news)"
    v-on:click="itemClicked(news)"
    v-bind:class="{ hover: this.hover && news.id !== activeNewsItemId,
                    active: news.id === activeNewsItemId,
                    'bottom-shadow': this.hover,
                    filter: this.applyFilter }"
    class="news-item flex-col light-border-bottom"
    v-bind:key="news.id"
    >
    <p class="title flex-col">
      {{ news.title }}
    </p>
    <p class="subtitle flex-col">
      <span>{{ news.source }}</span>
      <span>{{ prettifyDateObject(news.timestamp) }}</span>
    </p>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mapZoom, longTransitionToCounty } from '../store/d3Zoom';
import { prettifyDateObject } from '../store/helpers';

export default {
  name: 'newslistitem',
  props: ['showFilter', 'news'],
  data () {
    return {
      hover: false,
      mapZoom: mapZoom(this.setZoomValue)
    }
  },
  computed: {
    ...mapGetters([
      'countyByName',
      'activeNewsItemId',
      'selectedCounty',
      'selectedMunicipality',
      'zoomValue'
    ]),
    applyFilter: function () {
      if (this.selectedMunicipality) {
        return this.showFilter && this.news.location.municipality === this.selectedMunicipality;
      }

      return this.showFilter && this.news.location.county === this.selectedCounty;
    }
  },
  methods: {
    ...mapActions([
      'toggleActive',
      'setZoomValue'
    ]),
    itemClicked: function(news) {
      const previousCount = this.selectedCounty;
      this.toggleActive(news)
      const county = this.countyByName(news.location.county);
      if (this.selectedCounty !== previousCount) longTransitionToCounty(this.mapZoom, county);

    },
    toggleHover: function () {
      this.hover = !this.hover;
    },
    prettifyDateObject: function (dateObj) {
      return prettifyDateObject(dateObj)
    }
  }
}
</script>

<style src="../styles/NewsListItem.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
