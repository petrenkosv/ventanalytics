<template>
      <b-nav-item-dropdown right no-caret>
        <template slot="button-content">
          <img src="/static/img/no-logo.png" class="img-avatar">
        </template>
        <b-dropdown-header tag="div" class="text-center"><strong>Account</strong></b-dropdown-header>
        <b-dropdown-item :to="{ name: 'Account' }"><i class="fa fa-user"></i> Account</b-dropdown-item>
        <!--<b-dropdown-item :to="{ name: 'Payments' }"><i class="fa fa-usd"></i> Payments</b-dropdown-item>-->
        <b-dropdown-item @click="logout"><i class="fa fa-lock"></i> Logout</b-dropdown-item>
      </b-nav-item-dropdown>
</template>
<script>
export default {
  name: 'header-dropdown',
  methods: {
    logout() {
      this.$store.dispatch('user/logout');
    }
  }
}
</script>
