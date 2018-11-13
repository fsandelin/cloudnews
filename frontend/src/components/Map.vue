<template
 @keyup.esc="console.log('get')">
  <svg class="mapContainer">
    <g class="map">
      <path
        class="country"
        v-for="country in countries"
        v-bind:key="country.key"
        v-bind:d="country.path">
      </path>
      <path
        class="municipality"
        v-for="municipality in municipalities"
        v-bind:key="municipality.key"
        v-show="municipality.active"
        v-bind:d="municipality.path">
      </path>
      <path
        class="county"
        v-for="county in counties"
        v-bind:key="county.key"
        v-show="county.active"
        v-bind:d="county.path"
        v-on:click="countyClick(county)">
      </path>
      <circle
        class="circle-municipality"
        v-for="[metaData, news] of municipalityNews"
        v-bind:key="'newsNotification'+metaData.municipality.name"
        v-bind:cx="metaData.county.active ? metaData.county.x : metaData.municipality.x +'px'"
        v-bind:cy="metaData.county.active ? metaData.county.y : metaData.municipality.y +'px'"
        v-bind:r="circleSize(news.length)+'px'">
      </circle>
      <circle
        class="circle-county"
        v-for="[metaData, news] of countyNews"
        v-bind:key="'countyNewsNotification'+metaData.county.name"
        v-show="metaData.county.active"
        v-bind:cx="metaData.county.x+'px'"
        v-bind:cy="metaData.county.y+'px'"
        v-bind:r="circleSize(news.length)+'px'">
      </circle>
      <transition-group name="fade" tag="g">
      <text
        class="circle-number"
        v-for="[metaData, news] of municipalityNews"
        v-bind:key="'newsNotificationText'+metaData.municipality.name+news.id"
        v-show="metaData.municipality.active"
        text-anchor="middle"
        v-bind:x="metaData.municipality.x+'px'"
        v-bind:y="metaData.municipality.y+'px'"
        v-bind:dy="yOffset(news.length)+'px'"
        v-bind:font-size="fontSize(news.length)+'px'">
        {{news.length}}
      </text>
      <text
        class="circle-number"
        v-for="[metaData, news] of countyNews"
        v-bind:key="'countyNewsNotificationText'+metaData.county.name"
        v-show="metaData.county.active"
        text-anchor="middle"
        v-bind:x="metaData.county.x+'px'"
        v-bind:y="metaData.county.y+'px'"
        v-bind:dy="yOffset(news.length)+'px'"
        v-bind:font-size="fontSize(news.length)+'px'">
        {{news.length}}
      </text>
      </transition-group>
    </g>
  </svg>
</template>


<script>
export default {

}

</script>

<style>

</style>


<script>
import * as d3 from "d3";
import * as topojson from "topojson";
import swedishMunicipalities from '../assets/sweden-municipalities-meta-info.json';
import swedishCounties from '../assets/sweden-counties-meta-info.json';
import europeCountries from '../assets/europe-countries-meta-info.json';
import * as Velocity from "velocity-animate";


export default {
  name: "d3map",
  props: ['newsList'],
  data () {
    return {
      countries: [],
      counties: [],
      municipalities: [],
      cities: [],
      countryNews: [],
      countyNews: [],
      municipalityNews: [],
      cityNews: []
    }
  },
  mounted: function() {
    const RATIO = 2.1;
    const width = d3.select("#main-section").node().getBoundingClientRect().width;
    const height = d3.select("#main-section").node().getBoundingClientRect().height;
    const SIZE =
        width * RATIO < height
          ? width/500
          : height/500;

    function zoomed() {
      d3.select(".map").attr("transform", d3.event.transform);
    }

    const zoom = d3
      .zoom()
      .scaleExtent([0.7, 20])
      .on("zoom", zoomed);

    d3.select(".mapContainer").call(zoom);
    d3.select(".mapContainer").call(zoom.translateTo, 490,255);
    d3.select(".mapContainer").call(zoom.scaleTo, 0.9*SIZE);

    swedishMunicipalities.map(x => x.active = false);
    this.municipalities = this.municipalities.concat(swedishMunicipalities);

    swedishCounties.map(x => x.active = true);
    this.counties = this.counties.concat(swedishCounties);
  
    europeCountries.map(x => x.active = true);
    this.countries = this.countries.concat(europeCountries);

    this.calculateNewsList();
  },
  methods: {
    calculateNewsList: function() {
      for (const news of this.newsList) {
        const municipality = this.getMunicipalityByName(news.location.municipality);
        const county = this.getCountyByName(municipality.county);
        const newsMetaData = {
          municipality: municipality,
          county: county
        }
        
        this.addMunicipalityNews(news, newsMetaData);
        this.addCountyNews(news, newsMetaData)
      }
    },
    getCountyByName: function(name) {
      if (name === undefined) {
        return undefined;
      }

      for (const county of this.counties) {
        if(name.toLowerCase() === county.name) {
          return county;
        }
      }
    },
    getMunicipalityByName: function(name) {
      if (name === undefined) {
        return undefined;
      }

      for (const municipality of this.municipalities) {
        if(name.toLowerCase() === municipality.name) {
          return municipality;
        }
      }
    },
    countyClick: function(mouseoverCounty) {
      this.counties.map(county => county.active = !(county.name === mouseoverCounty.name));
      this.currentName = mouseoverCounty.name;
      this.municipalities.map(municipality => municipality.active = (municipality.county === mouseoverCounty.name));
    },
    circleSize: function(length) {
      return (4+(length/2));
    },
    fontSize: function(length) {
      return (4+(length/2));
    },
    yOffset: function(length) {
      return (4+(length/2))/3;
    },
    addMunicipalityNews: function(news, newsMetaData) {
      let found = false;
      let newsForMunicipality = [newsMetaData, []];
      for (let mNews of this.municipalityNews) {
        if (mNews[0].municipality.name === newsMetaData.municipality.name) {
          newsForMunicipality = mNews;
          found = true;
        }
      }
      newsForMunicipality[1].push(news);
      if (!found) {
        this.municipalityNews.push(newsForMunicipality);
      }
    },
    addCountyNews: function(news, newsMetaData) {
      let found = false;
      let newsForCounty = [newsMetaData, []];
      for (let cNews of this.countyNews) {
        if (cNews[0].county.name === newsMetaData.county.name) {
          newsForCounty = cNews;
          found = true;
        }
      }
      newsForCounty[1].push(news);
      if(!found) {
        this.countyNews.push(newsForCounty);
      }
    }
  }
}
</script>

<style src="../styles/Map.scss" lang="scss" scoped></style>
