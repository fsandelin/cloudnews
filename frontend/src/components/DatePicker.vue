<template>
  <div id="date-picker" class="full-shadow flex-col">
    <div class="header flex-row">

      <i class="material-icons">check</i>

      <div class="year-month flex-row">
        <i class="material-icons previous">navigate_next</i>
        <p class="flex-col">
          <span class="year">{{ currentYear }}</span>
          <span class="month">{{ currentMonth }}</span>
        </p>
        <i class="material-icons next">navigate_next</i>
      </div>

      <i class="material-icons">
        cancel
      </i>

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

const JANUARY =  'January';
const FEBRUARY =  'February';
const MARCH =  'March';
const APRIL =  'April';
const MAY =  'May';
const JUNE =  'June';
const JULY =  'July';
const AUGUST =  'August';
const SEPTEMBER =  'September';
const OCTOBER =  'October';
const NOVEMBER =  'November';
const DECEMBER =  'December';

const MONDAY =  'Monday';
const TUESDAY =  'Tuesday';
const WEDNESDAY =  'Wednesday';
const THURSDAY =  'Thursday';
const FRIDAY =  'Friday';
const SATURDAY =  'Saturday';
const SUNDAY =  'Sunday';

const tmp_dates = [
  { year: 2019, month: JANUARY, day: 29 },
  { year: 2019, month: JANUARY, day: 30 },
  { year: 2019, month: JANUARY, day: 31 },
  { year: 2019, month: FEBRUARY, day: 1 },
  { year: 2019, month: FEBRUARY, day: 2 },
  { year: 2019, month: FEBRUARY, day: 3 },
  { year: 2019, month: FEBRUARY, day: 4 },
  { year: 2019, month: FEBRUARY, day: 5 },
  { year: 2019, month: FEBRUARY, day: 6 },
  { year: 2019, month: FEBRUARY, day: 7 },
  { year: 2019, month: FEBRUARY, day: 8 },
  { year: 2019, month: FEBRUARY, day: 9 },
  { year: 2019, month: FEBRUARY, day: 10 },
  { year: 2019, month: FEBRUARY, day: 11 },
  { year: 2019, month: FEBRUARY, day: 12 },
  { year: 2019, month: FEBRUARY, day: 13 },
  { year: 2019, month: FEBRUARY, day: 14 },
  { year: 2019, month: FEBRUARY, day: 15 },
  { year: 2019, month: FEBRUARY, day: 16 },
  { year: 2019, month: FEBRUARY, day: 17 },
  { year: 2019, month: FEBRUARY, day: 18 },
  { year: 2019, month: FEBRUARY, day: 19 },
  { year: 2019, month: FEBRUARY, day: 20 },
  { year: 2019, month: FEBRUARY, day: 21 },
  { year: 2019, month: FEBRUARY, day: 22 },
  { year: 2019, month: FEBRUARY, day: 23 },
  { year: 2019, month: FEBRUARY, day: 24 },
  { year: 2019, month: FEBRUARY, day: 25 },
  { year: 2019, month: FEBRUARY, day: 26 },
  { year: 2019, month: FEBRUARY, day: 27 },
  { year: 2019, month: FEBRUARY, day: 28 },
  { year: 2019, month: MARCH, day: 1 },
  { year: 2019, month: MARCH, day: 2 },
  { year: 2019, month: MARCH, day: 3 },
  { year: 2019, month: MARCH, day: 4 },
  { year: 2019, month: MARCH, day: 5 },
  { year: 2019, month: MARCH, day: 6 },
  { year: 2019, month: MARCH, day: 7 },
  { year: 2019, month: MARCH, day: 8 },
  { year: 2019, month: MARCH, day: 9 },
  { year: 2019, month: MARCH, day: 10 },
  { year: 2019, month: MARCH, day: 11 }
]

export default {
  name: "datepicker",
  data () {
    return {
      currentYear: 2019,
      currentMonth: FEBRUARY,
      weekDays: [ MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY ],
      weekNumbers: [5, 6, 7, 8, 9, 10],
      dates: [ ...tmp_dates ]
    }
  },
  computed: {
    daysByRow: function () {
      return this.weekNumbers.map((_, i) => {
        return this.dates.slice(i*7, i*7+7)
      })
    }
  }
}
</script>

<style src="../styles/DatePicker.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
