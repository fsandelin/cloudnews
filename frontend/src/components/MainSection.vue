<template>
  <div id="main-section">
    <Map />
  </div>
</template>

<script>
import Map from './Map'

export default {
  name: 'MainSection',
  components: {
    'Map': Map
  }
}
</script>

<style src="../styles/Main.scss" lang="scss" scoped></style>
