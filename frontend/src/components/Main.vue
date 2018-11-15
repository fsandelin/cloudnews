<template>
  <div id="main-section">
    <d3map>
    </d3map>
  </div>
</template>

<script>
import Map from './Map';

export default {
  name: "mainsection",
  components: {
    'd3map': Map
  }
}
</script>

<style src="../styles/Main.scss" lang="scss" scoped></style>
