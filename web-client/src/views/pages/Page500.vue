<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="error-block">
        <div class="error-image-block">
          <div class="error-image" style="background-image: url('/static/img/500.svg');"></div>
        </div>
        <div class="error-text-block">
          <h1 class="error-text-h1">500</h1>
          <p class="error-text-p text-muted">Server error.</p>
          <b-btn @click="goBack">Go back</b-btn>
          <b-btn variant="primary" :to="'/'">Main page</b-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  methods: {
    goBack () {
      if (window.location.hash === "#/500") {
        window.history.go(-2)
      } else {
        window.history.go(-1)
      }
    }
  }
}
</script>
