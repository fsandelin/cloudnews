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
    <p class="text flex-centering">
      {{ news.text }}
    </p>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

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
      'getCountyByName',
      'activeNewsItemId',
      'selectedCounty'
    ]),
    applyFilter: function () {
      const county = this.getCountyByName(this.news.location.county);
      return this.showFilter && county === this.selectedCounty;
    }
  },
  methods: {
    ...mapActions([
      'toggleActive'
    ]),
    toggleHover: function () {
      this.hover = !this.hover;
    }
  }
}
</script>

<style src="../styles/NewsListItem.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
