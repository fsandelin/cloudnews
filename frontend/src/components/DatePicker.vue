<template>
  <div id="date-picker" class="full-shadow flex-centering">
    <div class="header flex-centering">

      <div class="year-month flex-centering">
        <i class="material-icons previous">
          navigate_next
        </i>
        <p>
          <span>February</span>
          <span>2019</span>
        </p>
        <i class="material-icons next">
          navigate_next
        </i>
      </div>
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
