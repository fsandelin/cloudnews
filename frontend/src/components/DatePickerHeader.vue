<template>
  <div class="header flex-row">
    <i
      :class="{ 'in-active': startDate === null }"
      class="material-icons"
      @click="startDate !== null ? toggleDatePicker() && saveNewDates() : null"
    >
      check
    </i>

    <div class="year-month flex-row">
      <i
        class="material-icons previous"
        @click="moveCalendarBackwards"
      >
        navigate_next
      </i>
      <p class="flex-col">
        <span class="year">
          {{ currentYear }}
        </span>
        <span class="month">
          {{ numToMonth(currentMonth) }}
        </span>
      </p>
      <i
        class="material-icons next"
        @click="moveCalendarForwards"
      >
        navigate_next
      </i>
    </div>

    <i
      class="material-icons"
      @click="() => toggleDatePicker() && discardNewDates()"
    >
      cancel
    </i>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Datepickerheader',
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
      'saveNewDates',
      'discardNewDates'
    ])
  }
}
</script>

<style src="../styles/DatePickerHeader.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
