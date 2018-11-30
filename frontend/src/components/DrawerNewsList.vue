<template>
  <div id="drawer-news-list">
    <div class="title light-border-bottom">
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
      {{ selectedCity ? 
          selectedCity :
          selectedMunicipality ? 
            selectedMunicipality : 
            selectedCounty }}
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
    ])
  },
  components: {
    'newslist': NewsList,
  },
}
</script>

<style src="../styles/DrawerNewsList.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
