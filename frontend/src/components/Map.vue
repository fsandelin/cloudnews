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
      <!-- <mapCities>
      </mapCities> -->
      <notifications>
      </notifications>
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
import { cleanString } from '../store/helpers';

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
      
      //Decimal Degrees = degrees + (minutes/60) + (seconds/3600)
      //58° 4' 57.0792'' N
      //12° 57' 5.562'' E
      //55°23′38″N Latitude
      //13°35′47″Ö Longitude'
      // city.latitude = "55°23′38″N";
      // city.longitude = "13°35′47″Ö";
      // city.municipality = "Skurups kommun";
      let latitudeDegrees = "55°23′38″N"; //city.latitude;
      let longitudeDegrees = "13°35′47″Ö"; //city.longitude;
      latitudeDegrees = latitudeDegrees.replace("°", ",").replace("′", ",").replace("″", ",").split(",");
      longitudeDegrees = longitudeDegrees.replace("°", ",").replace("′", ",").replace("″", ",").split(",");
      let latitudeDecimals = parseFloat(latitudeDegrees[0]) + parseFloat(latitudeDegrees[1]/60) + parseFloat(latitudeDegrees[2]/3600);
      let longitudeDecimals = parseFloat(longitudeDegrees[0]) + parseFloat(longitudeDegrees[1]/60) + parseFloat(longitudeDegrees[2]/3600);
      console.log("latitudeDegrees: " + latitudeDegrees);
      console.log("longitudeDegrees: " + longitudeDegrees);
      console.log("latitudeDecimals: " + latitudeDecimals);
      console.log("longitudeDecimals: " + longitudeDecimals);
      let cityCounty = null;
      let cityMun = null;
      let xy = this.XYFromLatLong(latitudeDecimals, longitudeDecimals);
      let x = xy[0];
      let y = xy[1];
      let municipality = this.municipalityByName(cleanString("Skurups kommun".replace("kommun", ""))); //this.municipalityByName(cleanString(city.municipality.replace("kommun", "")));
      if (municipality === undefined) {
        municipality = this.municipalityByName(cleanString("Skurups kommun".replace("s kommun", "")));
      }
      let county = this.countyByName(municipality.county);
      countriesString += 
      "\t{\n" + 
      "\t\t\"key\": \""+city.key+"\",\n" + 
      "\t\t\"name\": \""+city.name+"\",\n" + 
      "\t\t\"population\": "+city.population+",\n" + 
      "\t\t\"type\": \"city\",\n" + 
      "\t\t\"x\": "+x+",\n" + 
      "\t\t\"y\": "+y+",\n" + 
      "\t\t\"longitude\": "+latitudeDecimals+",\n" + 
      "\t\t\"latitude\": "+longitudeDecimals+",\n" + 
      "\t\t\"county\": \""+county.name+"\",\n" + 
      "\t\t\"municipality\": \""+municipality.name+"\"\n" + 
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
      'municipalityByName'
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
