<template>
  <div id="main-section">
    <MapSVG />
  </div>
</template>

<script>
import MapSVG from './MapSVG'

export default {
  name: 'MainSection',
  components: {
    'MapSVG': MapSVG
  }
}
</script>

<style src="../styles/Main.scss" lang="scss" scoped></style>
