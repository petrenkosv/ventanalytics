<template>
  <b-card>
    <b-card-body>
      <b-table :hover="true"
               :striped="true"
               :bordered="true"
               :items="users"
               :current-page="currentPage"
               :per-page="perPage"
               :fields="fields">
        <template slot="name" slot-scope="data">
          <b-btn class="p-0" variant="link" :to="'/admin/users/' + data.item.id">{{data.item.name}}</b-btn>
        </template>
        <template slot="status" slot-scope="data">
          <span class="badge" :class="data.item.status === 0 ? 'badge-warning' : (data.item.status === 1 ? 'badge-primary' : 'badge-danger')">
            {{ data.item.status === 0 ? 'Not confirmed' : (data.item.status === 1 ? 'Confirmed' : (data.item.status === 2 ? 'Blocked' : 'Deleted')) }}
          </span>
          <span v-if="data.item.status === 3">
            {{new Date(data.item.deleted_at).toISOString().split('T')[0]}}
          </span>
        </template>
        <template slot="created_at" slot-scope="data">
          {{new Date(data.item.created_at).toISOString().split('T')[0]}}
        </template>
        <template slot="updated_at" slot-scope="data">
          {{new Date(data.item.updated_at).toISOString().split('T')[0]}}
        </template>
      </b-table>
      <nav>
        <b-pagination :total-rows="users.length" :per-page="perPage" v-model="currentPage" prev-text="Prev" next-text="Next" hide-goto-end-buttons/>
      </nav>
    </b-card-body>
  </b-card>
</template>
<script>
  export default {
    name: 'admin-users-table',
    computed: {
      users() {
        return this.$store.state.adminUsers.users
      }
    },
    data() {
      return {
        currentPage: 1,
        perPage: 10,
        fields: [
          {key: 'name'},
          {key: 'username'},
          {key: 'email'},
          {key: 'status'},
          {key: 'created_at'},
          {key: 'updated_at'}
        ]
      }
    }
  }
</script>
