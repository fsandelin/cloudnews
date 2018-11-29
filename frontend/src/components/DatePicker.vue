<template>
  <div id="date-picker" class="full-shadow flex-col">
    <dpheader></dpheader>
    <dpcalendar></dpcalendar>
    <dpfooter></dpfooter>
  </div>
</template>

<script>
import DatePickerHeader from './DatePickerHeader';
import DatePickerCalendar from './DatePickerCalendar';
import DatePickerFooter from './DatePickerFooter';

export default {
  name: "datepicker",
  components: {
    'dpheader': DatePickerHeader,
    'dpcalendar': DatePickerCalendar,
    'dpfooter': DatePickerFooter
  },
}
</script>

<style src="../styles/DatePicker.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
