<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  /* ============
   * Entry Point
   * ============
   *
   * The entry point of the application
   */

  export default {
    /**
     * The name of the application.
     */
    name: 'ventanalytics',

    /**
     * Fires when the app has been mounted.
     */
    mounted () {
      if (this.$store.state.user.authenticated) {
        this.$store.dispatch('account/profile');
      }
    },
  };
</script>
