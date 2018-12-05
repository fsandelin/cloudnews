<template>
  <div id="drawer-news-list">
    <div class="header flex-row light-border-bottom">
      <i class="material-icons back"
        v-if="selectedCity"
        v-on:click="selectCity(null)">
        reply
      </i>
      <i class="material-icons back"
        v-else-if="selectedMunicipality"
        v-on:click="selectMunicipality(null)">
        reply
      </i>
      <p class="title">
        {{title()}}
      </p>
    </div>
    <newslist
      v-bind:filteredNewsList="filteredNewsList"
      v-bind:showFilter="showFilter">
    </newslist>
  </div>
</template>

<script>
import NewsList from './NewsList'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'drawernewslist',
  props: ['showFilter'],
  computed: {
    ...mapGetters([
      'selectedCounty',
      'selectedMunicipality',
      'selectedCity',
      'filteredNewsList',
    ]),
  },
  methods: {
    ...mapActions([
      'selectMunicipality',
      'selectCity'
    ]),
    title: function() {
      if (this.selectedCity) return this.selectedCity;
      if (this.selectedMunicipality) return this.selectedMunicipality;
      return this.selectedCounty;
    }
  },
  components: {
    'newslist': NewsList,
  },
}
</script>

<style src="../styles/DrawerNewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
