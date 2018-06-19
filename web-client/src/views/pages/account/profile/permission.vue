<template>
  <b-card>
    <div slot="header">
      <strong>Permissions</strong>
    </div>
    <b-table :hover="true"
             :striped="true"
             :bordered="true"
             :small="true"
             :fixed="true"
             :items="permissions"
             class="m-0"
             :fields="fields">
      <template slot="expires_in" slot-scope="data">
        {{new Date(data.item.expires_in).toISOString().split('T')[0]}}
      </template>
    </b-table>
  </b-card>
</template>
<script>
  export default {
    name: 'account-page-permissions',
    props: {
      permissions: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        fields: [
          {key: 'module'},
          {key: 'expires_in'}
        ]
      }
    }
  }
</script>
