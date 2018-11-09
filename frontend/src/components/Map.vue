<template>
  <svg class="mapContainer">
      <g class="map">
        <path
          class="country"
          v-bind:key="country.key"
          v-for="country in countries"
          v-bind:d="country.path"
          v-bind:name="country.name">
        </path>
        <path
          class="municipality"
          v-bind:key="municipality.key"
          v-for="municipality in municipalities"
          v-bind:d="municipality.path"
          v-bind:name="municipality.name">
        </path>
        <path
          class="county"
          v-bind:key="county.key"
          v-for="county in counties"
          v-bind:d="county.path"
          v-bind:name="county.name">
        </path>
        <circle
          class="notification"
          v-bind:key="'notification'+newsItem.id"
          v-for="newsItem in newsList"
          v-bind:cx="getLocationOfName(newsItem.locationName).x+'px'"
          v-bind:cy="getLocationOfName(newsItem.locationName).y+'px'"
          v-bind:r="'6px'">
        </circle>
      </g>
    </svg>
</template>

<script>
import * as d3 from "d3";
import * as topojson from "topojson";
import municipalities from '../assets/sweden-municipalities.json';
import counties from '../assets/sweden-counties.json';
import countries from '../assets/europe-countries.json';

export default {
  name: "d3map",
  props: ['newsList'],
  data () {
    return {
      municipalities: [],
      counties: [],
      countries: []
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

    const projection = d3.geoMercator()
      .scale(SIZE * 900)
      .translate([SIZE * -255 + width/2, (SIZE) * 1525]);

    const pathFunction = d3.geoPath().projection(projection);

    const countyFeatures = topojson.feature(counties, counties.objects.SWE_adm1).features;
    const municipalityFeatures = topojson.feature(municipalities, municipalities.objects.kommuner).features;
    const countryFeatures = topojson.feature(countries, countries.objects.continent_Europe_subunits).features;

    for (const index in countyFeatures) {
      const countyFeature = countyFeatures[index];
      const path = pathFunction(countyFeature);
      const name = countyFeature.properties.NAME_1.toLowerCase();
      const location = this.pathToLocation(path);
      this.addCounty(index, path, name, location);
    }
    for (const index in municipalityFeatures) {
      const municipalityFeature = municipalityFeatures[index];
      const path = pathFunction(municipalityFeature);
      const name = municipalityFeature.properties.KNNAMN.toLowerCase();
      const location = this.pathToLocation(path);
      this.addMunicipality(index, path, name, location);
    }
    for (const index in countryFeatures) {
      const countryFeature = countryFeatures[index];
      const path = pathFunction(countryFeature);
      const name = countryFeature.properties.geounit.toLowerCase();
      const location = this.pathToLocation(path);
      this.addCountry(index, path, name, location);

    }
  },
  methods: {
    addMunicipality: function(index, path, name, location) {
      this.municipalities.push({
        key: 'municipality-'+index,
        name: name,
        path: path,
        location: location
        });
    },
    addCounty: function(index, path, name, location) {
      this.counties.push({
        key: 'county-'+index,
        name: name,
        path: path,
        location: location
        })
    },
    addCountry: function(index, path, name, location) {
      this.countries.push({
        key: 'country-'+index,
        name: name,
        path: path,
        location: location
      });
    },
    pathToLocation: function(path) {
      if (path === null) {
        return {
          x: 0,
          y: 0
        }
      }
      let xMin = undefined;
      let xMax = undefined;
      let yMin = undefined;
      let yMax = undefined;
      let splitted = path.split(/[LMC]/);
      for (let index in splitted) {
        const xy = splitted[index].split(",");
        if (xy.length != 2) {
          continue;
        }

        if (xMin === undefined || parseFloat(xy[0]) < xMin) {
          xMin = parseFloat(xy[0]);
        }
        if (xMax === undefined || parseFloat(xy[0]) > xMax) {
          xMax = parseFloat(xy[0]);
        }
        if (yMin === undefined || parseFloat(xy[1]) < yMin) {
          yMin = parseFloat(xy[1]);
        }
        if (yMax === undefined || parseFloat(xy[1]) > yMax) {
          yMax = parseFloat(xy[1]);
        }
      }
      const xMiddle = xMax-((xMax-xMin)/2);
      const yMiddle = yMax-((yMax-yMin)/2);

      return {
        x: xMiddle,
        y: yMiddle
      }; 
    },
    getLocationOfName: function(name) {
      for (const index in this.counties) {
        const county = this.counties[index];
        if(name.toLowerCase() === county.name) {
          return {
            x: county.location.x,
            y: county.location.y
          };
        }
      }

      return {
        x: 0,
        y: 0
      }
    }
  }
}
</script>

<style src="../styles/Map.scss" lang="scss" scoped></style>
