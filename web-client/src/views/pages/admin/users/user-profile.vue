<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="8">
        <MainInfo :account="user"/>
      </b-col>
      <b-col md="4">
        <ChangePassword :account="user"/>
      </b-col>
      <b-col md="6">
        <ManagePermissions :account="user"/>
      </b-col>
      <b-col md="6">
        <ManageToken/>
      </b-col>
    </b-row>
  </div>
</template>
<script>
  import MainInfo from '../../account/profile/maininfo';
  import ChangePassword from '../../account/profile/change-password';
  import ManagePermissions from './user-manage-permissions';
  import ManageToken from './user-manage-token';

  export default {
    name: 'admin-users-profile',
    components: {
      MainInfo,
      ChangePassword,
      ManagePermissions,
      ManageToken
    },
    created () {
      this.$store.dispatch('adminUsers/searchUserByID', this.$route.params.id)
    },
    computed: {
      user () {
        return this.$store.getters['adminUsers/getUser'];
      }
    }
  }
</script>
