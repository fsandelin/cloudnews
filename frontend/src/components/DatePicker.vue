<template>
  <div id="date-picker" class="full-shadow flex-col">
    <div class="header flex-row">

      <i class="material-icons">check</i>

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

      <i class="material-icons">cancel</i>

    </div>

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
                 v-on:click="selectDate(date)"
                 class="day flex-col"
                 v-bind:class="{ 'current-month': date.month === currentMonth,
                  active: date === startDate || date === endDate,
                  'in-between': dateBetweenStartAndEnd(date) }">
                {{ date.day }}
            </div>

          </div>

        </div>
      </div>
    </div>

    <div class="footer">

    </div>

  </div>
</template>

<script>
import { months as m, weekDays as wd } from '../store/constants';
import { numToMonth, getDaysForMonth, getNumArrayBetweenNums } from '../store/helpers';

export default {
  name: "datepicker",
  data () {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      weekDays: [ wd.MONDAY, wd.TUESDAY, wd.WEDNESDAY, wd.THURSDAY, wd.FRIDAY, wd.SATURDAY, wd.SUNDAY ],
      weekNumbers: [5, 6, 7, 8, 9, 10],
      startDate: null,
      endDate: null
    }
  },
  computed: {
    daysByRow: function () {
      const dates = this.getDaysToDisplay()
      return this.weekNumbers.map((_, i) => {
        return dates.slice(i*7, i*7+7)
      })
    },
  },
  methods: {
    getDaysToDisplay() {
      const daysForCurrentMonth = getDaysForMonth(this.currentYear, this.currentMonth)

      const currentDaysToFill = getNumArrayBetweenNums(1, daysForCurrentMonth+1)
        .map(i => ({ year: this.currentYear, month: this.currentMonth, day: i }))

      const weekDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const numPreviousDaysToFill = weekDay === 0 ? 7 : weekDay;

      const daysForPreviousMonth = this.currentMonth === 0
        ? getDaysForMonth(this.currentYear-1, this.currentMonth+11)
        : getDaysForMonth(this.currentYear, this.currentMonth-1)

      const previousDaysToFill = getNumArrayBetweenNums(daysForPreviousMonth-numPreviousDaysToFill+2, daysForPreviousMonth+1)
        .map(i => ({ year: this.currentYear, month: this.currentMonth-1, day: i }))

      const TOTAL_DAYS_TO_SHOW = 42;
      const numNextDaysToFill = TOTAL_DAYS_TO_SHOW - (daysForCurrentMonth+numPreviousDaysToFill)

      const nextDaysToFill = getNumArrayBetweenNums(1, numNextDaysToFill+1)
        .map(i => ({ year: this.currentYear, month: this.currentMonth+1, day: i }))

      return [ ...previousDaysToFill, ...currentDaysToFill, ...nextDaysToFill ]
    },
    moveCalendarForwards() {
      if (this.currentMonth === 11) {
        this.currentYear++
        this.currentMonth = 0
      } else {
        this.currentMonth++
      }
    },
    moveCalendarBackwards() {
      if (this.currentMonth === 0) {
        this.currentYear--
        this.currentMonth = 11
      } else {
        this.currentMonth--
      }
    },
    selectDate(date) {
      // TODO:
      // if before startDate --> change startDate to endDate and set date to startDate
      // if after endDate --> set endDate to date
      // if between startDate and endDate --> set endDate to date
      if (date === this.startDate) {
        this.startDate = null
      } else if (date === this.endDate) {
        this.endDate = null
      } else if (this.startDate === null) {
        this.startDate = date
      } else {
        this.endDate = date
      }
    },
    numToMonth: function (num) {
      return numToMonth(num)
    },
    dateBetweenStartAndEnd(date) {
      // TODO: if no end date or start date --> check hover
      return date !== null && this.startDate !== null && this.endDate !== null &&
             date.year <= this.endDate.year && date.year >= this.startDate.year &&
             date.month <= this.endDate.month && date.month >= this.startDate.month &&
             date.day < this.endDate.day && date.day > this.startDate.day
    }
  }
}
</script>

<style src="../styles/DatePicker.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
