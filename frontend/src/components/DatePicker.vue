<template>
  <div id="date-picker" class="full-shadow flex-col">
    <div class="header flex-row">
      <i class="material-icons previous">
        navigate_next
      </i>
      <p class="flex-col">
        <span>2019</span>
        <span>February</span>
      </p>
      <i class="material-icons next">
        navigate_next
      </i>
    </div>

    <div class="calendar">

    </div>

    <div class="footer">

    </div>

  </div>
</template>

<script>
export default {
  name: "datepicker"
}
</script>

<style src="../styles/DatePicker.scss" lang="scss" scoped></style>
<style src="../styles/Commons.scss" lang="scss" scoped></style>
