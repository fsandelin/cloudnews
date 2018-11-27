<template>
  <div id="date-picker" class="full-shadow flex-col">
    <div class="header flex-row">

      <i class="material-icons">
        check
      </i>

      <div class="year-month flex-row">
        <i class="material-icons previous">
          navigate_next
        </i>
        <p class="flex-col">
          <span class="year">2019</span>
          <span class="month">February</span>
        </p>
        <i class="material-icons next">
          navigate_next
        </i>
      </div>

      <i class="material-icons">
        cancel
      </i>

    </div>

    <div class="calendar flex-col">
      <div class="week-days flex-row">
        <div class="day flex-col"></div>
        <div class="day flex-col">M</div>
        <div class="day flex-col">T</div>
        <div class="day flex-col">W</div>
        <div class="day flex-col">T</div>
        <div class="day flex-col">F</div>
        <div class="day flex-col">S</div>
        <div class="day flex-col">S</div>
      </div>
      <div class="wrapper flex-row">
        <div class="week-numbers flex-col">
          <div class="week flex-col">5</div>
          <div class="week flex-col">6</div>
          <div class="week flex-col">7</div>
          <div class="week flex-col">8</div>
          <div class="week flex-col">9</div>
          <div class="week flex-col">10</div>
        </div>
        <div class="days">
          <div class="row flex-row">
            <div class="day flex-col">29</div>
            <div class="day flex-col">30</div>
            <div class="day flex-col">31</div>
            <div class="day current-month flex-col">1</div>
            <div class="day current-month flex-col">2</div>
            <div class="day current-month flex-col">3</div>
            <div class="day current-month flex-col">4</div>
          </div>
          <div class="row flex-row">
            <div class="day current-month flex-col">5</div>
            <div class="day current-month flex-col">6</div>
            <div class="day current-month flex-col">7</div>
            <div class="day current-month flex-col">8</div>
            <div class="day current-month flex-col">9</div>
            <div class="day current-month flex-col">10</div>
            <div class="day current-month flex-col">11</div>
          </div>
          <div class="row flex-row">
            <div class="day current-month flex-col">12</div>
            <div class="day current-month flex-col">13</div>
            <div class="day current-month flex-col">14</div>
            <div class="day current-month flex-col">15</div>
            <div class="day current-month flex-col">16</div>
            <div class="day current-month flex-col">17</div>
            <div class="day current-month flex-col">18</div>
          </div>
          <div class="row flex-row">
            <div class="day current-month flex-col">19</div>
            <div class="day current-month flex-col">20</div>
            <div class="day current-month flex-col">21</div>
            <div class="day current-month flex-col">22</div>
            <div class="day current-month flex-col">23</div>
            <div class="day current-month flex-col">24</div>
            <div class="day current-month flex-col">25</div>
          </div>
          <div class="row flex-row">
            <div class="day current-month flex-col">26</div>
            <div class="day current-month flex-col">27</div>
            <div class="day current-month flex-col">28</div>
            <div class="day flex-col">1</div>
            <div class="day flex-col">2</div>
            <div class="day flex-col">3</div>
            <div class="day flex-col">4</div>
          </div>
          <div class="row flex-row">
            <div class="day flex-col">5</div>
            <div class="day flex-col">6</div>
            <div class="day flex-col">7</div>
            <div class="day flex-col">8</div>
            <div class="day flex-col">9</div>
            <div class="day flex-col">10</div>
            <div class="day flex-col">11</div>
          </div>
        </div>
      </div>
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
