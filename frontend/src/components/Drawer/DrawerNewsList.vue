<template>
  <div id="drawer-news-list">
    <div class="header flex-row light-border-bottom">
      <i
        v-if="selectedCity"
        class="material-icons back"
        @click="selectCity(null)">
        reply
      </i>
      <i
        v-else-if="selectedMunicipality"
        class="material-icons back"
        @click="selectMunicipality(null)">
        reply
      </i>
      <p class="title">
        {{ title() }}
      </p>
    </div>
    <NewsList
      :filteredNewsList="filteredNewsList"
      :showFilter="showFilter" />
  </div>
</template>

<script>
import NewsList from '../News/NewsList'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'DrawerNewsList',
  components: {
    'NewsList': NewsList
  },
  props: ['showFilter'],
  computed: {
    ...mapGetters([
      'selectedCounty',
      'selectedMunicipality',
      'selectedCity',
      'filteredNewsList'
    ])
  },
  methods: {
    ...mapActions([
      'selectMunicipality',
      'selectCity'
    ]),
    title: function () {
      if (this.selectedCity) return this.selectedCity
      if (this.selectedMunicipality) return this.selectedMunicipality
      return this.selectedCounty
    }
  }
}
</script>

<style src="./DrawerNewsList.scss" lang="scss" scoped></style>
