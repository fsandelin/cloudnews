<template>
  <li
    :key="news.id"
    :class="{ hover: hover && news.id !== activeNewsItemId,
              active: news.id === activeNewsItemId,
              'bottom-shadow': hover,
              filter: applyFilter }"
    class="news-item flex-col light-border-bottom"
    @mouseenter="toggleHover(news)"
    @mouseleave="toggleHover(news)"
    @click="itemClicked(news)">
    <p class="title flex-col">
      {{ news.title }}
    </p>
    <p class="subtitle flex-col">
      <span>{{ news.source }}</span>
      <span>{{ prettifyDateObject(news.datetime).slice(0, 10) }}</span>
    </p>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { mapZoom, longTransitionToCounty } from '../../helpers/d3Zoom'
import { prettifyDateObject } from '../../helpers/misc'

export default {
  name: 'NewsListItem',
  props: {
    'showFilter': {
      type: Boolean,
      default: false
    },
    'news': {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      hover: false,
      mapZoom: mapZoom(this.setZoomValue)
    }
  },
  computed: {
    ...mapGetters([
      'countyById',
      'activeNewsItemId',
      'selectedCounty',
      'selectedCountyId',
      'selectedMunicipality',
      'selectedCity',
      'zoomValue'
    ]),
    applyFilter: function () {
      if (this.selectedCity) return this.showFilter && this.news.location.city === this.selectedCity
      if (this.selectedMunicipality) return this.showFilter && this.news.location.municipality === this.selectedMunicipality
      return this.showFilter && this.news.location.county === this.selectedCounty
    }
  },
  methods: {
    ...mapActions([
      'toggleActive',
      'setZoomValue'
    ]),
    itemClicked: function (news) {
      const activeCountyIdBeforeClick = this.selectedCountyId
      this.toggleActive(news)
      const activeCountyAfterClick = this.countyById(news.locationIds.countyId)
      if (this.selectedCountyId !== activeCountyIdBeforeClick) longTransitionToCounty(this.mapZoom, activeCountyAfterClick)
    },
    toggleHover: function () {
      this.hover = !this.hover
    },
    prettifyDateObject: function (dateObj) {
      return prettifyDateObject(dateObj)
    }
  }
}
</script>

<style src="./NewsListItem.scss" lang="scss" scoped></style>
