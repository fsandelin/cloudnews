<template>
  <div id="app">
    <newssidebar
      v-bind:newsList="newsList"
      v-bind:toggleActive="toggleActive"
    ></newssidebar>
    <mainsection
      v-bind:newsList="newsList"
    ></mainsection>
    <settingssidebar></settingssidebar>
  </div>
</template>

<script>
import Main from './Main'
import NewsSideBar from './NewsSideBar'
import SettingsSideBar from './SettingsSideBar'

export default {
  name: 'app',
  data () {
    return {
      newsList: [
        { 
          id: 0, title: "News title 0", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "kiruna",
            city: ""
          }
        },
        { 
          id: 1, title: "News title 1", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "lekeberg",
            city: ""
          }
        },
        { 
          id: 2, title: "News title 2", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "uppsala",
            city: ""
          }
        },
        { 
          id: 3, title: "News title 3", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "Uppsala",
            city: ""
          }
        },
        { 
          id: 4, title: "News title 4", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "kiruna",
            city: ""
          }
        },
        { 
          id: 5, title: "News title 5", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "kiruna",
            city: ""
          }
        },
        { 
          id: 6, title: "News title 6", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "pajala",
            city: ""
          }
        },
        { 
          id: 7, title: "News title 7", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "kiruna",
            city: ""
          }
        },
        { 
          id: 8, title: "News title 8", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "piteå",
            city: ""
          }
        },
        { 
          id: 9, title: "News title 9", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "piteå",
            city: ""
          }
        },
        { 
          id: 10, title: "News title 10", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "piteå",
            city: ""
          }
        },
        { 
          id: 11, title: "News title 11", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "piteå",
            city: ""
          }
        },
        { 
          id: 12, title: "News title 12", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "kiruna",
            city: ""
          }
        },
        { 
          id: 13, title: "News title 13", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "haparanda",
            city: ""
          }
        },
        { 
          id: 14, title: "News title 14", text: "Lorem Ipsum is simply dummy text of the printing", active: false,
          location: {
            country: "",
            county: "",
            municipality: "haparanda",
            city: ""
          }
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    toggleActive: function(news) {
      news.active = !news.active
    }
  },
  components: {
    'mainsection': Main,
    'newssidebar': NewsSideBar,
    'settingssidebar': SettingsSideBar
  }
}
</script>

<style src="../styles/App.scss" lang="scss" scoped></style>
