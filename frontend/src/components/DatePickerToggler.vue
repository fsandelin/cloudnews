<template>
  <div id="date-picker-toggler" class="full-shadow">
    <div class="flex-row">
      <p>{{ prettifyDateObject(startDate) }}</p>
      <p v-if="endDate !== null">to {{ prettifyDateObject(endDate) }}</p>
      <i v-on:click="toggleDatePicker"
         class="material-icons">edit</i>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { prettifyDateObject } from '../store/helpers';

export default {
  name: "datepickertoggler",
  computed: {
    ...mapGetters([
      'startDate',
      'endDate',
    ]),
  },
  methods: {
    ...mapActions([
      'toggleDatePicker',
    ]),
    prettifyDateObject: function (dateObj) {
      return prettifyDateObject(dateObj)
    }
  },
}
</script>

<style src="../styles/DatePickerToggler.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
