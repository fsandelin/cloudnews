<template>
  <div
    id="date-picker-toggler"
    class="full-shadow"
    @click="toggleDatePicker">
    <div class="flex-row">
      <p>{{ prettifyDateObject(newsStartDate) }}</p>
      <p v-if="newsEndDate !== null">
        to {{ prettifyDateObject(newsEndDate) }}
      </p>
      <i class="material-icons">
        edit
      </i>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { prettifyDateObject } from '../../helpers/misc'

export default {
  name: 'Datepickertoggler',
  computed: {
    ...mapGetters([
      'newsStartDate',
      'newsEndDate'
    ])
  },
  methods: {
    ...mapActions([
      'toggleDatePicker'
    ]),
    prettifyDateObject: function (dateObj) {
      return prettifyDateObject(dateObj)
    }
  }
}
</script>

<style src="./DatePickerToggler.scss" lang="scss" scoped></style>
