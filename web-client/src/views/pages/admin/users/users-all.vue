<template>
  <div class="animated fadeIn">
    <form data-vv-scope="searchForm" @submit.prevent="searchUsers">
      <b-form-group>
        <b-input-group>
          <b-input-group-prepend>
            <b-button variant="primary" type="submit">
              <i class="fa fa-search"></i> Search
            </b-button>
          </b-input-group-prepend>
          <b-form-input type="text"
                        name="name"
                        placeholder="Enter name or username or email"
                        autocomplete="off"
                        v-model="searchName"></b-form-input>
          <b-input-group-prepend>
            <b-dropdown :text="selectedAction.name" variant="primary">
              <b-dropdown-item v-for="(item) in searchActions"
                               :key="item.name"
                               :data-status="item.status"
                               @click="setAction">{{item.name}}</b-dropdown-item>
            </b-dropdown>
          </b-input-group-prepend>
        </b-input-group>
      </b-form-group>
    </form>
    <UserTable/>
  </div>
</template>
<script>
  import UserTable from './user-table'

  export default {
    name: 'admin-users-all',
    components: {
      UserTable
    },
    created() {
      this.$store.dispatch('adminUsers/searchUsers', {});
    },
    data() {
      return {
        searchName: null,
        searchActions: [
          {name: 'All users', status: null},
          {name: 'Not confirmed users', status: 0},
          {name: 'Confirmed users', status: 1},
          {name: 'Blocked users', status: 2},
          {name: 'Deleted users', status: 3}
        ],
        selectedAction: {name: 'All users', status: null}
      }
    },
    methods: {
      searchUsers () {
        this.$store.dispatch('adminUsers/searchUsers', {
          name: this.searchName,
          status: this.selectedAction.status
        });
      },
      setAction (event) {
        this.selectedAction = {
          name: event.target.textContent,
          status: parseInt(event.target.dataset.status)
        };
        this.searchUsers();
      }
    }
  }
</script>
