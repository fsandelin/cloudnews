<template>
  <div id="date-picker" class="full-shadow flex-col">
    <div class="header flex-row">

      <i class="material-icons">check</i>

      <div class="year-month flex-row">
        <i class="material-icons previous">navigate_next</i>
        <p class="flex-col">
          <span class="year">{{ currentYear }}</span>
          <span class="month">{{ numToMonth(currentMonth) }}</span>
        </p>
        <i class="material-icons next">navigate_next</i>
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
                 class="day flex-col"
                 v-bind:class="{ 'current-month': date.month === currentMonth }">
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

const tmp_dates = [
  { year: 2019, month: m.JANUARY, day: 29 },
  { year: 2019, month: m.JANUARY, day: 30 },
  { year: 2019, month: m.JANUARY, day: 31 },
  { year: 2019, month: m.FEBRUARY, day: 1 },
  { year: 2019, month: m.FEBRUARY, day: 2 },
  { year: 2019, month: m.FEBRUARY, day: 3 },
  { year: 2019, month: m.FEBRUARY, day: 4 },
  { year: 2019, month: m.FEBRUARY, day: 5 },
  { year: 2019, month: m.FEBRUARY, day: 6 },
  { year: 2019, month: m.FEBRUARY, day: 7 },
  { year: 2019, month: m.FEBRUARY, day: 8 },
  { year: 2019, month: m.FEBRUARY, day: 9 },
  { year: 2019, month: m.FEBRUARY, day: 10 },
  { year: 2019, month: m.FEBRUARY, day: 11 },
  { year: 2019, month: m.FEBRUARY, day: 12 },
  { year: 2019, month: m.FEBRUARY, day: 13 },
  { year: 2019, month: m.FEBRUARY, day: 14 },
  { year: 2019, month: m.FEBRUARY, day: 15 },
  { year: 2019, month: m.FEBRUARY, day: 16 },
  { year: 2019, month: m.FEBRUARY, day: 17 },
  { year: 2019, month: m.FEBRUARY, day: 18 },
  { year: 2019, month: m.FEBRUARY, day: 19 },
  { year: 2019, month: m.FEBRUARY, day: 20 },
  { year: 2019, month: m.FEBRUARY, day: 21 },
  { year: 2019, month: m.FEBRUARY, day: 22 },
  { year: 2019, month: m.FEBRUARY, day: 23 },
  { year: 2019, month: m.FEBRUARY, day: 24 },
  { year: 2019, month: m.FEBRUARY, day: 25 },
  { year: 2019, month: m.FEBRUARY, day: 26 },
  { year: 2019, month: m.FEBRUARY, day: 27 },
  { year: 2019, month: m.FEBRUARY, day: 28 },
  { year: 2019, month: m.MARCH, day: 1 },
  { year: 2019, month: m.MARCH, day: 2 },
  { year: 2019, month: m.MARCH, day: 3 },
  { year: 2019, month: m.MARCH, day: 4 },
  { year: 2019, month: m.MARCH, day: 5 },
  { year: 2019, month: m.MARCH, day: 6 },
  { year: 2019, month: m.MARCH, day: 7 },
  { year: 2019, month: m.MARCH, day: 8 },
  { year: 2019, month: m.MARCH, day: 9 },
  { year: 2019, month: m.MARCH, day: 10 },
  { year: 2019, month: m.MARCH, day: 11 }
]

export default {
  name: "datepicker",
  data () {
    return {
      currentYear: 2018,
      currentMonth: 1,
      weekDays: [ wd.MONDAY, wd.TUESDAY, wd.WEDNESDAY, wd.THURSDAY, wd.FRIDAY, wd.SATURDAY, wd.SUNDAY ],
      weekNumbers: [5, 6, 7, 8, 9, 10],
      dates: [ ...tmp_dates ]
    }
  },
  computed: {
    daysByRow: function () {
      const dates = this.getDaysToDisplay()
      return this.weekNumbers.map((_, i) => {
        return dates.slice(i*7, i*7+7)
      })
    }
  },
  methods: {
    numToMonth(num) {
      return m[Object.keys(m)[num]]
    },
    getDaysForMonth(year, month) {
      return new Date(year, month+1, 0).getDate()
    },
    getNumArrayBetweenNums(start, end) {
      let arr = []
      for (let i = start; i < end; i++) {
        arr = [ ...arr, i]
      }
      return arr
    },
    getDaysToDisplay() {
      const daysForCurrentMonth = this.getDaysForMonth(this.currentYear, this.currentMonth)

      const currentDaysToFill = this.getNumArrayBetweenNums(1, daysForCurrentMonth+1)
        .map(i => ({ year: this.currentYear, month: this.currentMonth, day: i }))

      const weekDay = new Date(this.currentYear, this.currentMonth, 1).getDay()-1;
      const numPreviousDaysToFill = weekDay;
      const daysForPreviousMonth = this.getDaysForMonth(this.currentYear, this.currentMonth-1) // if january --> previous year instead

      const previousDaysToFill = this.getNumArrayBetweenNums(daysForPreviousMonth-numPreviousDaysToFill+1, daysForPreviousMonth+1)
        .map(i => ({ year: this.currentYear, month: this.currentMonth-1, day: i }))

      const TOTAL_DAYS_TO_SHOW = 42;
      const numNextDaysToFill = TOTAL_DAYS_TO_SHOW - (daysForCurrentMonth+numPreviousDaysToFill)

      const nextDaysToFill = this.getNumArrayBetweenNums(1, numNextDaysToFill+1)
        .map(i => ({ year: this.currentYear, month: this.currentMonth+1, day: i }))

      return [ ...previousDaysToFill, ...currentDaysToFill, ...nextDaysToFill ]
    }
  }
}
</script>

<style src="../styles/DatePicker.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
