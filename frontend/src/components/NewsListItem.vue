<template>
  <li
    @mouseenter="toggleHover(news)"
    @mouseleave="toggleHover(news)"
    v-on:click="itemClicked(news)"
    v-bind:class="{ hover: this.hover && news.id !== activeNewsItemId,
                    active: news.id === activeNewsItemId,
                    'bottom-shadow': this.hover,
                    filter: this.applyFilter }"
    class="news-item flex-centering light-border-bottom"
    v-bind:key="news.id"
    >
    <p class="title flex-centering">
      {{ news.title }}
    </p>
    <p class="subtitle flex-centering">
      <span>{{ news.source }}</span>
      <span>{{ news.timestamp }}</span>
    </p>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mapZoom, longTransitionToCounty } from '../store/d3Zoom';

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
      'zoomValue'
    ]),
    applyFilter: function () {
      return this.showFilter && this.news.location.county === this.selectedCounty;
    }
  },
  methods: {
    ...mapActions([
      'toggleActive',
      'setZoomValue'
    ]),
    itemClicked: function(news) {
      const county = this.countyByName(news.location.county);
      if (this.selectedCounty !== county.name) longTransitionToCounty(this.mapZoom, county);
      this.toggleActive(news)
    },
    toggleHover: function () {
      this.hover = !this.hover;
    }
  }
}
</script>

<style src="../styles/NewsListItem.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
