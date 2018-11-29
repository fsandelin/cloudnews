<template>
  <div class="footer flex-row">
    <div class="flex-row start-date"
      v-bind:class="{ active: startDate !== null }">
      <i v-on:click="startDate !== null ? selectDate(startDate) : null"
         class="material-icons">replay</i>
      <p v-on:click="startDate !== null ? moveCalendarToDate(startDate) : null"
         class="flex-col">
        <span>Start date</span>
        <span class="date">{{ prettifyDateObject(startDate) }}</span>
      </p>
    </div>
    <div class="flex-row end-date"
      v-bind:class="{ active: endDate !== null }">
      <p v-on:click="endDate !== null ? moveCalendarToDate(endDate) : null"
         class="flex-col">
        <span>End date</span>
        <span class="date">{{ prettifyDateObject(endDate) }}</span>
      </p>
      <i v-on:click="endDate !== null ? selectDate(endDate) : null"
         class="material-icons">replay</i>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "datepickerfooter",
  computed: {
    ...mapGetters([
      'startDate',
      'endDate',
    ])
  },
  methods: {
    ...mapActions([
      'moveCalendarBackwards',
      'moveCalendarForwards',
      'selectDate',
      'moveCalendarToDate',
    ]),
    prettifyDateObject: function (dateObj = '????-??-??') {
      if (dateObj === null) return '????-??-??'
      return `${dateObj.year}-${dateObj.month}-${dateObj.day}`
    }
  },
}
</script>

<style src="../styles/DatePickerFooter.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
