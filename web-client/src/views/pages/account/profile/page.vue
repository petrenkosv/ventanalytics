<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="8">
        <MainInfo :account="account"/>
        <Token :token="token"/>
      </b-col>
      <b-col md="4">
        <ChangePassword :account="account"/>
        <Permissions :permissions="permissions"/>
      </b-col>
    </b-row>
  </div>
</template>
<script>
  import MainInfo from './maininfo';
  import ChangePassword from './change-password';
  import Permissions from './permission';
  import Token from './api-token';

  export default {
    name: 'account-page',
    computed: {
      account() {
        return this.$store.getters['account/mainInfo']
      },
      permissions () {
        return this.$store.getters['account/permissionsArray']
      },
      token() {
        return this.$store.getters['account/apiToken']
      }
    },
    components: {
      MainInfo,
      Permissions,
      ChangePassword,
      Token
    }
  }
</script>
