<template>
  <div id="date-picker" class="full-shadow flex-col">
    <dpheader
      v-bind:moveCalendarBackwards="moveCalendarBackwards"
      v-bind:currentYear="currentYear"
      v-bind:numToMonth="numToMonth"
      v-bind:currentMonth="currentMonth"
      v-bind:moveCalendarForwards="moveCalendarForwards">
    </dpheader>
    <dpcalendar
      v-bind:weekDays="weekDays"
      v-bind:weekNumbers="weekNumbers"
      v-bind:daysByRow="daysByRow"
      v-bind:currentMonth="currentMonth"
      v-bind:selectDate="selectDate"
      v-bind:startDate="startDate"
      v-bind:endDate="endDate"
      v-bind:dateBetweenStartAndEnd="dateBetweenStartAndEnd">
    </dpcalendar>
    <dpfooter></dpfooter>
  </div>
</template>

<script>
import { months as m, weekDays as wd } from '../store/constants';
import { numToMonth, getDaysForMonth, getNumArrayBetweenNums } from '../store/helpers';
import DatePickerHeader from './DatePickerHeader';
import DatePickerCalendar from './DatePickerCalendar';
import DatePickerFooter from './DatePickerFooter';

export default {
  name: "datepicker",
  data () {
    return {
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      weekDays: [ wd.MONDAY, wd.TUESDAY, wd.WEDNESDAY, wd.THURSDAY, wd.FRIDAY, wd.SATURDAY, wd.SUNDAY ],
      weekNumbers: [5, 6, 7, 8, 9, 10], // TODO: these shouldnt be hard-coded
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
  components: {
    'dpheader': DatePickerHeader,
    'dpcalendar': DatePickerCalendar,
    'dpfooter': DatePickerFooter
  },
  methods: {
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
    numToMonth: function (num) {
      return numToMonth(num)
    },
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
    selectDate(date) {
      if (this.startDate === date) {
        this.startDate = this.endDate
        this.endDate = null
      }
      else if (this.endDate === date) this.endDate = null
      else if (this.startDate === null && this.endDate === null) this.startDate = date
      else if (this.dateIsBefore(date, this.startDate)) {
        if (this.endDate === null) this.endDate = this.startDate
        this.startDate = date
      }
      else if (!this.dateIsBefore(date, this.startDate)) this.endDate = date
    },
    dateIsBefore(date, comparedTo) {
      if (date === null || comparedTo === null) return false
      if (date.year > comparedTo.year) return false
      if (date.year < comparedTo.year) return true

      if (date.month > comparedTo.month) return false
      if (date.month < comparedTo.month) return true

      if (date.day > comparedTo.day) return false
      if (date.day < comparedTo.day) return true
    },
    dateBetweenStartAndEnd(date) {
      return this.dateIsBefore(this.startDate, date) && this.dateIsBefore(date, this.endDate)
    }
  }
}
</script>

<style src="../styles/DatePicker.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
