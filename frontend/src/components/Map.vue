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
        v-for="[name, news] of municipalityNews"
        v-bind:key="'newsNotification'+name"
        v-bind:cx="munX(name)+'px'"
        v-bind:cy="munY(name)+'px'"
        v-bind:r="(4+(news.length/2))+'px'">
      </circle>
      <circle
        class="circle-county"
        v-for="[name, news] of countyNews"
        v-bind:key="'countyNewsNotification'+name"
        v-show="getCountyByName(name).active"
        v-bind:cx="getCountyByName(name).x+'px'"
        v-bind:cy="getCountyByName(name).y+'px'"
        v-bind:r="(4+news.length/2)+'px'">
      </circle>
      <transition-group name="fade" tag="g">
      <text
        class="circle-number"
        v-for="[name, news] of municipalityNews"
        v-bind:key="'newsNotificationText'+name+news.id"
        v-show="getMunicipalityByName(name).active"
        text-anchor="middle"
        v-bind:x="getMunicipalityByName(name).x+'px'"
        v-bind:y="getMunicipalityByName(name).y+'px'"
        v-bind:dy="-1+(4+(news.length/2))/2+'px'"
        v-bind:font-size="(4+(news.length/2))+'px'">
        {{news.length}}
      </text>
      <text
        class="circle-number"
        v-for="[name, news] of countyNews"
        v-bind:key="'countyNewsNotificationText'+name"
        v-show="getCountyByName(name).active"
        text-anchor="middle"
        v-bind:x="getCountyByName(name).x+'px'"
        v-bind:y="getCountyByName(name).y+'px'"
        v-bind:dy="(4+(news.length/2))/3+'px'"
        v-bind:font-size="(4+(news.length/2))+'px'">
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
    munX: function(name) {
      const municipality = this.getMunicipalityByName(name);
      const county = this.getCountyByName(municipality.county);
      return county.active ? county.x : municipality.x;
    },
    munY: function(name) {
      const municipality = this.getMunicipalityByName(name);
      const county = this.getCountyByName(municipality.county);
      return county.active ? county.y : municipality.y;
    },
    calculateNewsList: function() {
      for (const news of this.newsList) {
        if (news.location.city !== null && news.location.city !== "") {
          //City news

        } else if (news.location.municipality !== null && news.location.municipality !== "") {
          //Municipality news
          const municipality = this.getMunicipalityByName(news.location.municipality);
          let found = false;
          let newsForMunicipality = [municipality.name, []];
          
          for (let mNews of this.municipalityNews) {
            if (mNews[0] === municipality.name) {
              newsForMunicipality = mNews;
              found = true;
            }
          }
          newsForMunicipality[1].push(news);
          if (!found) {
            this.municipalityNews.push(newsForMunicipality);
          }

          found = false;
          let newsForCounty = [municipality.county, []];
          for (let cNews of this.countyNews) {
            if (cNews[0] === municipality.county) {
              newsForCounty = cNews;
              found = true;
            }
          }
          newsForCounty[1].push(news);
          if(!found) {
            this.countyNews.push(newsForCounty);
          }
        } else if (news.location.county !== null && news.location.county !== "") {
          //County news
          
        } else if (news.location.country !== null && news.location.country !== "") {
          //Country news

        }
      }
    },
    getCountyByName: function(name) {
      for (const county of this.counties) {
        if(name.toLowerCase() === county.name) {
          return county;
        }
      }
    },
    getMunicipalityByName: function(name) {
      for (const municipality of this.municipalities) {
        if(name.toLowerCase() === municipality.name) {
          return municipality;
        }
      }
    },
    countyClick: function(mouseoverCounty) {
      this.counties.map(county => county.active = !(county.name === mouseoverCounty.name));
      console.log(mouseoverCounty.name);
      this.municipalities.map(municipality => municipality.active = (municipality.county === mouseoverCounty.name));
    }
  }
}
</script>

<style src="../styles/Map.scss" lang="scss" scoped></style>
