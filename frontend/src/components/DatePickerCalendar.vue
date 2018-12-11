<template>
  <div class="calendar flex-col">
    <div class="week-days flex-row">
      <div class="day flex-col" />
      <div
        v-for="weekDay in weekDays"
        :key="weekDay"
        class="day flex-col">
        {{ weekDay[0] }}
      </div>
    </div>
    <div class="wrapper flex-row">
      <div class="week-numbers flex-col">
        <div
          v-for="weekNumber in weekNumbers"
          :key="weekNumber"
          class="week flex-col">
          {{ weekNumber }}
        </div>
      </div>
      <div class="days">
        <div
          v-for="row in daysByRow"
          :key="daysByRow.indexOf(row)"
          class="row flex-row">
          <div
            v-for="date in row"
            :key="date.day+date.month+date.year"
            class="day flex-col"
            :class="{ 'current-month': date.month === currentMonth,
                      'in-between-hover': dateBetween(date, hoverDate, startDate),
                      'in-between-selected': (sameDates(date, startDate) || sameDates(date, endDate)) || dateBetween(date, startDate, endDate) }"
            @mouseenter="toggleHoverDate(date)"
            @mouseleave="toggleHoverDate(date)"
            @click="selectDate(date)">
            {{ date.day }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { sameDates } from '../store/helpers'

export default {
  name: 'DatePickerCalendar',
  computed: {
    ...mapGetters([
      'weekDays',
      'weekNumbers',
      'daysByRow',
      'currentMonth',
      'startDate',
      'endDate',
      'hoverDate',
      'dateBetween'
    ])
  },
  methods: {
    ...mapActions([
      'selectDate',
      'toggleHoverDate'
    ]),
    sameDates: function (date1, date2) {
      return sameDates(date1, date2)
    }
  }
}
</script>

<style src="../styles/DatePickerCalendar.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
