<template>
  <div id="sidebar">
    <ul>
      <li class="header">
        NEWS
      </li>
      <li
        class="news-item"
        v-for="news in newsList"
        v-bind:news="news"
        v-bind:key="news.id"
        >
        <p class="title">
          {{ news.title }}
        </p>
        <p class="text">
          {{ news.text }}
        </p>
        </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'sidebar',
  props: ['newsList']
}
</script>

<style lang="scss" scoped>

#sidebar {
  border-right: 2px solid grey;
  height: 100%;
  width: 250px;
  position: absolute;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  border-bottom: 2px solid grey;
  padding: 10px;
}

.header {
  height: 100px;
}

.news-item {
  height: 60px;

  p {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
  }

  .title {
    font-size: 20px;
  }

}

</style>