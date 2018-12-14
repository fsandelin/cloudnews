<template>
  <div id="popup-container">
    <div class="wrapper">
      <div class="full-shadow">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PopUpContainer'
}
</script>

<style src="./PopUpContainer.scss" lang="scss" scoped></style>
