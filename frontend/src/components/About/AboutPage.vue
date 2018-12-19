<template>
  <div
    id="about-page"
    class="flex-col">
    <div class="header flex-row">
      <p>About CloudNews</p>
    </div>

    <div class="body">
      <p>
        &lt;To be written&gt;<br>
        Check out the source code on:
        <a
          class="flex-col"
          href="https://github.com/antoncarlsson/cloudnews"
          target="_blank">
          Github
        </a>
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
