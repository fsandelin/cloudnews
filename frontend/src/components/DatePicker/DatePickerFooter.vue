<template>
  <div class="footer flex-row">
    <div
      class="flex-row start-date"
      :class="{ active: startDate !== null }">
      <i
        class="material-icons"
        @click="startDate !== null ? selectDate(startDate) : null">
        replay
      </i>
      <p
        class="flex-col"
        @click="startDate !== null ? moveCalendarToDate(startDate) : null">
        <span>Start date</span>
        <span class="date">
          {{ prettifyDateObject(startDate) }}
        </span>
      </p>
    </div>
    <div
      class="flex-col today"
      @click="moveCalendarToCurrentMonth">
      <p>today</p>
    </div>
    <div
      class="flex-row end-date"
      :class="{ active: endDate !== null }">
      <p
        class="flex-col"
        @click="endDate !== null ? moveCalendarToDate(endDate) : null">
        <span>End date</span>
        <span class="date">
          {{ prettifyDateObject(endDate) }}
        </span>
      </p>
      <i
        class="material-icons"
        @click="endDate !== null ? selectDate(endDate) : null">
        replay
      </i>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { prettifyDateObject } from '../../helpers/misc'

export default {
  name: 'DatePickerFooter',
  computed: {
    ...mapGetters([
      'startDate',
      'endDate'
    ])
  },
  methods: {
    ...mapActions([
      'moveCalendarBackwards',
      'moveCalendarForwards',
      'selectDate',
      'moveCalendarToDate',
      'moveCalendarToCurrentMonth'
    ]),
    prettifyDateObject: function (dateObj) {
      return prettifyDateObject(dateObj)
    }
  }
}
</script>

<style src="./DatePickerFooter.scss" lang="scss" scoped></style>
<style src="../../styles/Commons.scss" lang="scss" scoped></style>
