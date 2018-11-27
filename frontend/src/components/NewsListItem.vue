<template>
  <li
    @mouseenter="toggleHover(news)"
    @mouseleave="toggleHover(news)"
    v-on:click="toggleActive(news)"
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
    <p class="source flex-centering">
      {{ news.source }}
    </p>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import {
  getters as g,
  actions as a
} from '../store/constants'

export default {
  name: 'newslistitem',
  props: ['showFilter', 'news'],
  data () {
    return {
      hover: false
    }
  },
  computed: {
    ...mapGetters([
      g.COUNTY_BY_NAME,
      g.ACTIVE_NEWS_ITEM_ID,
      g.SELECTED_COUNTY
    ]),
    applyFilter: function () {
      return this.showFilter && this.news.location.county === this.selectedCounty;
    }
  },
  methods: {
    ...mapActions([
      a.TOGGLE_ACTIVE
    ]),
    toggleHover: function () {
      this.hover = !this.hover;
    }
  }
}
</script>

<style src="../styles/NewsListItem.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
