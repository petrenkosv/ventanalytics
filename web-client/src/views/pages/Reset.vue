<template>
  <form class="app flex-row align-items-center" @submit.prevent="validateForm('form')" data-vv-scope="form">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8" lg="6">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <h1>Reset password</h1>
              <p class="text-muted">Get password reset link to email</p>
              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text>@</b-input-group-text>
                </b-input-group-prepend>
                <input
                  v-model="formModel.email"
                  v-validate="{required: true, email: true, max: 128}"
                  v-bind:class="{ 'is-invalid': errors.has('form.email') }"
                  name="email"
                  type="email"
                  class="form-control"
                  placeholder="Email">
                <b-form-invalid-feedback>
                  {{ errors.first('form.email') }}
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
  name: 'reset-page',
  data() {
    return {
      formModel: {
        email: null
      }
    }
  },
  methods: {
    validateForm(scope) {
      this.$validator.validateAll(scope).then((result) => {
        if (result) {
          this.$store.dispatch('user/resetPassword', this.formModel)
        }
      })
    }
  }
}
</script>
