<template>
    <div class="calendar flex-col">
      <div class="week-days flex-row">
        <div class="day flex-col"></div>
        <div v-for="weekDay in weekDays"
             v-bind:key="weekDay"
             class="day flex-col">
          {{ weekDay[0] }}
        </div>
      </div>
      <div class="wrapper flex-row">
        <div class="week-numbers flex-col">
          <div v-for="weekNumber in weekNumbers"
              v-bind:key="weekNumber"
              class="week flex-col">
            {{ weekNumber }}
          </div>
        </div>
        <div class="days">

          <div v-for="row in daysByRow"
               v-bind:key="daysByRow.indexOf(row)"
               class="row flex-row">

            <div v-for="date in row"
                 v-bind:key="date.day+date.month+date.year"
                 @mouseenter="toggleHoverDate(date)"
                 @mouseleave="toggleHoverDate(date)"
                 v-on:click="selectDate(date)"
                 class="day flex-col"
                 v-bind:class="{ 'current-month': date.month === currentMonth,
                  'in-between-hover': dateBetween(date, hoverDate, startDate),
                  'in-between-selected': (date === startDate || date === endDate) || dateBetween(date, startDate, endDate) }">
                {{ date.day }}
            </div>

          </div>

        </div>
      </div>
    </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "datepickercalendar",
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
      'toggleHoverDate',
    ])
  },
}
</script>

<style src="../styles/DatePickerCalendar.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
