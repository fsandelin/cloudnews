<template>
  <div
    id="about-page"
    class="flex-col">
    <div class="header flex-row">
      <p>CloudNews</p>
    </div>

    <div class="body">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </div>

    <div class="footer">
      <span @click="toggleAboutPage">
        close
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'AboutPage',
  methods: {
    ...mapActions([
      'toggleAboutPage'
    ])
  }
}
</script>

<style src="./AboutPage.scss" lang="scss" scoped></style>
