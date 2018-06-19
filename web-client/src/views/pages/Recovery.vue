<template>
  <form class="app flex-row align-items-center" @submit.prevent="validateForm('form')" data-vv-scope="form">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8" lg="6">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <h1>Recovery access to account</h1>
              <p class="text-muted">Create new password</p>
              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                </b-input-group-prepend>
                <input
                  v-model="formModel.password"
                  v-validate="{required: true, max: 64}"
                  v-bind:class="{ 'is-invalid': errors.has('form.password') }"
                  name="password"
                  type="password"
                  class="form-control"
                  placeholder="Password">
                <b-form-invalid-feedback>
                  {{ errors.first('form.password') }}
                </b-form-invalid-feedback>
              </b-input-group>

              <b-input-group class="mb-4">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                </b-input-group-prepend>
                <input
                  v-model="formModel.repeat_password"
                  v-validate="{required: true, confirmed: 'password'}"
                  v-bind:class="{ 'is-invalid': errors.has('form.repeat_password') }"
                  name="repeat_password"
                  type="password"
                  class="form-control"
                  placeholder="Repeat password">
                <b-form-invalid-feedback>
                  {{ errors.first('form.repeat_password') }}
                </b-form-invalid-feedback>
              </b-input-group>
              <b-button type="submit" variant="success" block>Reset password</b-button>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </form>
</template>

<script>
export default {
  name: 'recovery-page',
  data() {
    return {
      formModel: {
        password: null,
        password1: null,
        hash: this.$store.state.route.query.hash
      }
    }
  },
  methods: {
    validateForm(scope) {
      this.$validator.validateAll(scope).then((result) => {
        if (result) {
          this.$store.dispatch('user/recoveryAccess', this.formModel)
        }
      })
    }
  }
}
</script>
