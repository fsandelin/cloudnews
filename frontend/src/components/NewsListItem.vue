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
    <p class="source flex-centering">
      {{ news.source }}
    </p>
  </li>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import * as d3 from "d3";
import {
  getters as g,
  actions as a
} from '../store/constants'

export default {
  name: 'newslistitem',
  props: ['showFilter', 'news'],
  data () {
    return {
      hover: false,
      mapZoom: d3.zoom()
                .wheelDelta(() => {
                  let deltaY = d3.event.deltaY > 0 ? 125 : -125
                  return -deltaY * (1) / 500;
                })
                .scaleExtent([0.2, 50])
                .on("zoom", this.zoomed)
    }
  },
  computed: {
    ...mapGetters([
      g.COUNTY_BY_NAME,
      g.ACTIVE_NEWS_ITEM_ID,
      g.SELECTED_COUNTY,
      g.ZOOM_VALUE
    ]),
    applyFilter: function () {
      return this.showFilter && this.news.location.county === this.selectedCounty;
    }
  },
  methods: {
    zoomed: function() {
      d3.select(".map").attr("transform", d3.event.transform);
      
      if (d3.event.transform.k !== this.zoomValue) {
        this.setZoomValue(d3.event.transform.k);
      }
    },
    ...mapActions([
      a.TOGGLE_ACTIVE,
      a.SET_ZOOM_VALUE
    ]),
    itemClicked: function(news) {
      const county = this.countyByName(news.location.county);
      this.transition(county.x, county.y)
      this.toggleActive(news)
    },
    toggleHover: function () {
      this.hover = !this.hover;
    },
    sizeOfCurrentWindow() { 
      const ratio = 2.1;
      const width = d3.select("#main-section").node().getBoundingClientRect().width;
      const height = d3.select("#main-section").node().getBoundingClientRect().height;
      const size =
        width * ratio < height
          ? width/500
          : height/500;
      return size;
    },
    transition(x, y) {
      const size = this.sizeOfCurrentWindow()
      const newZoomValue = 3.0*size;
      const xOffset = (100*(size/newZoomValue))
      d3.select(".mapContainer").transition().duration(350).call(this.mapZoom.scaleTo, 1)
                                .transition().duration(450).call(this.mapZoom.translateTo, x+ xOffset, y)
                                .transition().duration(350).call(this.mapZoom.scaleTo, newZoomValue);
                     
    }
  }
}
</script>

<style src="../styles/NewsListItem.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
