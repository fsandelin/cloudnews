<template>
  <svg class="mapContainer">
    <g class="map">
      <g>
        <path
          class="country"
          v-for="country in countries"
          v-bind:key="country.key"
          v-bind:d="country.path">
        </path>
        <path
          class="municipality"
          v-for="municipality in this.municipalities"
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
      </g>
      <mapCities>
      </mapCities>
      <notifications>
      </notifications>
      <rect
        v-bind:key="'abc123'"
        v-bind:ref="'abc123'"
        v-bind:x="rectX+'px'"
        v-bind:y="rectY+'px'"
        v-bind:width="1+'px'"
        v-bind:height="1+'px'">
      </rect>
    </g>
  </svg>
</template>

<script>
import * as d3 from "d3";
import Notifications from './Notifications'
import MapCities from './MapCities'
import { mapZoom, transitionToCounty, initialZoom, sizeOfCurrentWindow, XYFromLatLong} from '../store/d3Zoom';
import { mapGetters, mapActions } from 'vuex';
import PISP from "point-in-svg-polygon";

export default {
  name: "d3map",
  components: {
    'notifications': Notifications,
    'mapCities': MapCities
  },
  data () {
    return {
      mapZoom: mapZoom(this.setZoomValue),
      rectX: 0,
      rectY: 0
    }
  },
  mounted: function() {
    d3.select(".mapContainer").call(this.mapZoom).on("dblclick.zoom", () => transitionToCounty(this.mapZoom, (this.countyByName(this.selectedCounty))));
    initialZoom(this.mapZoom);

    let countriesString = "[";
    for (let city of this.cities) {
      let xy = this.XYFromLatLong(city.latitude, city.longitude);
      let x = xy[0];
      let y = xy[1];
      let cityCounty = null;
      let cityMun = null;
      // for (let mun of this.municipalities) {
      //   if (PISP.isInside([x, y], mun.path)) {
      //     cityMun = mun.name;
      //   }
      // }
      // for (let county of this.counties) {
      //   if (PISP.isInside([x, y], county.path)) {
      //     cityCounty = county.name;
      //   }
      // }
      countriesString += 
      "\t{\n" + 
      "\t\t\"key\": \""+city.key+"\",\n" + 
      "\t\t\"name\": \""+city.name+"\",\n" + 
      "\t\t\"population\": "+city.population+",\n" + 
      "\t\t\"type\": \"city\",\n" + 
      "\t\t\"x\": "+x+",\n" + 
      "\t\t\"y\": "+y+",\n" + 
      "\t\t\"longitude\": "+city.longitude+",\n" + 
      "\t\t\"latitude\": "+city.latitude+",\n" + 
      "\t\t\"county\": \""+cityCounty+"\",\n" + 
      "\t\t\"municipality\": \""+cityMun+"\"\n" + 
      "\t},\n";
      console.log(city.name);
    }
    console.log(countriesString);
  },
  computed: {
    ...mapGetters([
      'countries',
      'counties',
      'municipalities',
      'cities',
      'zoomValue',
      'selectedCounty',
      'countyByName',
    ])
  },
  methods: {
    ...mapActions([
      'countyClick',
      'setZoomValue',
    ]),
    XYFromLatLong: (latitude, longitude) => (XYFromLatLong(latitude, longitude))
  }
}
</script>

<style src="../styles/Map.scss" lang="scss" scoped></style>
