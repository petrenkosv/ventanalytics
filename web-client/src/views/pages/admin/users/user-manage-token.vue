<template>
  <b-card>
    <div slot="header">
      <strong>Manage API token</strong>
      <b-badge :variant="'success'" v-if="token && token.active">active</b-badge>
      <b-badge :variant="'danger'" v-else-if="token">not active</b-badge>
    </div>
    <form v-if="token" @submit.prevent="validateForm('adminApiToken')" data-vv-scope="adminApiToken">
      <b-form-group
        label="Token:"
        :label-cols="2"
        :horizontal="true">
        <div class="mt-1">{{token.token}}</div>
      </b-form-group>
      <b-form-group
        label="Token status:"
        :label-for="'active'"
        :label-cols="2"
        :horizontal="true">
        <b-form-radio-group :id="'active'"
                            class="mt-2"
                            :plain="true"
                            :checked="formModel.active"
                            v-model="formModel.active"
                            :options="[ {text: 'Active ', value: 'true'}, {text: 'Not active',value: 'false'} ]">
        </b-form-radio-group>
      </b-form-group>
      <b-form-group
        label="Valid date:"
        description="In format `YYYY-MM-DD`"
        :label-for="'valid_date'"
        :label-cols="2"
        :horizontal="true">
        <b-form-input :id="'valid_date'" type="date"
                      name="valid_date"
                      v-validate="{required: true}"
                      v-bind:class="{ 'is-invalid': errors.has('adminApiToken.valid_date') }"
                      v-model="formModel.valid_date"
                      :value="formModel.valid_date"></b-form-input>
        <b-form-invalid-feedback>
          {{ errors.first('adminApiToken.valid_date') }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        label="Requests:"
        :label-for="'requests'"
        :label-cols="2"
        :horizontal="true">
        <b-form-input :id="'requests'" type="number"
                      name="requests"
                      v-validate="{required: true, min_value: 0}"
                      v-bind:class="{ 'is-invalid': errors.has('adminApiToken.requests') }"
                      v-model="formModel.requests"
                      :value="formModel.requests"></b-form-input>
        <b-form-invalid-feedback>
          {{ errors.first('adminApiToken.requests') }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group
        label="Limits:"
        :label-for="'limits'"
        :label-cols="2"
        :horizontal="true">
        <b-form-input :id="'limits'" type="number"
                      name="limits"
                      v-validate="{required: true, min_value: formModel.requests}"
                      v-bind:class="{ 'is-invalid': errors.has('adminApiToken.limits') }"
                      v-model="formModel.limits"
                      :value="formModel.limits"></b-form-input>
        <b-form-invalid-feedback>
          {{ errors.first('adminApiToken.limits') }}
        </b-form-invalid-feedback>
      </b-form-group>
      <div slot="footer">
        <b-btn variant="link" v-b-modal.modalApiTokenHistory size="sm">History</b-btn>
        <b-btn type="submit" size="sm" variant="primary" class="float-right">Update</b-btn>
      </div>
      <TokenHistory :token="token ? token.token : ''"/>
    </form>
    <div v-else>Token does not existed.</div>
  </b-card>
</template>
<script>
  import TokenHistory from '../../account/profile/api-token-history';
  export default {
    name: 'admin-user-manage-token',
    components: {
      TokenHistory
    },
    data () {
      return {
        formModel: {
          active: false,
          valid_date: null,
          requests: null,
          limits: null
        }
      }
    },
    computed: {
      token() {
        let user = this.$store.getters['adminUsers/getUser'];
        if(user.tokens_api) this.setData(user.tokens_api);
        return user.tokens_api;
      }
    },
    methods: {
      setData(data) {
        this.formModel.valid_date = new Date(data.valid_date).toISOString().split('T')[0];
        this.formModel.requests = data.requests;
        this.formModel.limits = data.limits;
        this.formModel.active = data.active;
      },
      validateForm(scope) {
        this.$validator.validateAll(scope).then(async (result) => {
          if (result) {
            let data = Object.assign({id: this.token.token}, this.formModel);
            this.$store.dispatch('adminUsers/updateApiToken', data);
          }
        })
      },
    }
  }
</script>
