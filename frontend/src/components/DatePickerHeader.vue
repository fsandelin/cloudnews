<template>
  <div class="header flex-row">

    <i v-on:click="startDate !== null ? toggleDatePicker() : null"
       v-bind:class="{ 'in-active': startDate === null }"
       class="material-icons">check</i>

    <div class="year-month flex-row">
      <i v-on:click="moveCalendarBackwards"
          class="material-icons previous">navigate_next</i>
      <p class="flex-col">
        <span class="year">{{ currentYear }}</span>
        <span class="month">{{ numToMonth(currentMonth) }}</span>
      </p>
      <i v-on:click="moveCalendarForwards"
          class="material-icons next">navigate_next</i>
    </div>

    <i v-on:click="toggleDatePicker"
       class="material-icons">cancel</i>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "datepickerheader",
  computed: {
    ...mapGetters([
      'currentYear',
      'numToMonth',
      'currentMonth',
      'startDate'
    ])
  },
  methods: {
    ...mapActions([
      'moveCalendarBackwards',
      'moveCalendarForwards',
      'toggleDatePicker',
    ])
  },
}
</script>

<style src="../styles/DatePickerHeader.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
