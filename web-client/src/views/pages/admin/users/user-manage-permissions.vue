<template>
  <b-card>
    <div slot="header">
      <strong>Manage permissions</strong>
      <b-btn variant="primary" size="sm" class="float-right"
             v-b-modal.modalDeletePermission><i class="fa fa-plus"></i> new</b-btn>
    </div>
    <b-table :hover="true"
             :striped="true"
             :bordered="true"
             :small="true"
             :items="account.permissionsArray"
             class="m-0"
             :fields="fields">
      <template slot="expires_in" slot-scope="data">
        {{new Date(data.item.expires_in).toISOString().split('T')[0]}}
      </template>
      <template slot="created_at" slot-scope="data">
        {{new Date(data.item.created_at).toISOString().split('T')[0]}}
      </template>
      <template slot=" " slot-scope="data" center>
        <b-btn variant="link" class="p-0 text-danger" :data-id="data.item.id" @click="removePermission"><i class="fa fa-close"></i></b-btn>
      </template>
    </b-table>
    <b-modal id="modalDeletePermission"
             title="Add permission"
             @ok="addPermission"
             ok-title="Add">
      <form @submit.stop.prevent="addPermissionSubmit()" data-vv-scope="newPermission">
        <b-form-group label="Permission" label-for="newPermission">
          <multiselect id="newPermission"
                       v-model="permissionModel.module"
                       :options='permissions'
                       autocomplete="off"
                       name="module"
                       :searchable="true"
                       :close-on-select="true"
                       :show-labels="false"
                       placeholder="Choose a permission"/>
        </b-form-group>
        <b-form-group label="Expires date" label-for="newExpiresDate" description="Must in format `YYYY-MM-DD`" class="mb-0">
          <b-form-input id="newExpiresDate"
                        type="date"
                        name="expires"
                        autocomplete="off"
                        v-model="permissionModel.expires_in"></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </b-card>
</template>
<script>
  import Multiselect from 'vue-multiselect';
  import VueNotifications from 'vue-notifications';

  export default {
    name: 'admin-user-manage-permissions',
    components: {
      Multiselect
    },
    props: {
      account: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        permissions: this.$store.state.adminUsers.permissions,
        fields: [
          {key: 'module'},
          {key: 'expires_in'},
          {key: 'created_at'},
          {key: ' ','class': 'text-center'}
        ],
        permissionModel: {
          module: null,
          expires_in: null
        }
      }
    },
    methods: {
      removePermission (event) {
        let id = event.target.dataset.id;
        if (!id) id = event.target.parentNode.dataset.id;
        this.$store.dispatch('adminUsers/removePermission', id);
      },
      addPermission (event) {
        if (this.permissionModel.module === null || this.permissionModel.expires_in === null) {
          event.preventDefault();
          VueNotifications.warn({title: "Complete form"});
        } else {
          this.addPermissionSubmit();
        }
      },
      addPermissionSubmit () {
        this.$store.dispatch('adminUsers/addPermission', Object.assign({id: this.account.id}, this.permissionModel));
        this.permissionModel.module = null;
        this.permissionModel.expires_in =null;
      }
    }
  }
</script>
