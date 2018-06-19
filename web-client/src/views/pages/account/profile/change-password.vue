<template>
  <form @submit.prevent="validateForm('changePasswordForm')" data-vv-scope="changePasswordForm">
    <b-card>
      <div slot="header">
        <strong>Change password</strong>
      </div>
      <b-input-group class="mb-3">
        <b-input-group-prepend>
          <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
        </b-input-group-prepend>
        <input
          v-model="formModel.password"
          v-validate="{required: true, max: 64}"
          v-bind:class="{ 'is-invalid': errors.has('changePasswordForm.password') }"
          name="password"
          type="password"
          class="form-control"
          placeholder="New password">
        <b-form-invalid-feedback>
          {{ errors.first('changePasswordForm.password') }}
        </b-form-invalid-feedback>
      </b-input-group>
      <b-input-group>
        <b-input-group-prepend>
          <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
        </b-input-group-prepend>
        <input
          v-model="formModel.repeat_password"
          v-validate="{required: true, confirmed: 'password'}"
          v-bind:class="{ 'is-invalid': errors.has('changePasswordForm.repeat_password') }"
          name="repeat_password"
          type="password"
          class="form-control"
          placeholder="Repeat new password">
        <b-form-invalid-feedback>
          {{ errors.first('changePasswordForm.repeat_password') }}
        </b-form-invalid-feedback>
      </b-input-group>
      <div slot="footer">
        <b-btn type="submit" size="sm" variant="primary" class="float-right">Change password</b-btn>
      </div>
    </b-card>
  </form>
</template>
<script>
  export default {
    name: 'account-page-change-password',
    props: {
      account: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        formModel: {
          password: null,
          repeat_password: null
        }
      }
    },
    methods: {
      validateForm(scope) {
        this.$validator.validateAll(scope).then(async (result) => {
          if (result) {
            let data = Object.assign({id: this.account.id}, this.formModel);
            await this.$store.dispatch('account/changePassword', data);
            this.formModel.password = null;
            this.formModel.repeat_password = null;
            this.$validator.reset(this.formModel);
          }
        })
      },
    }
  }
</script>
