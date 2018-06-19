<template>
  <div class="app flex-row align-items-center">
    <form class="container" @submit.prevent="validateForm('form')" data-vv-scope="form">
      <b-row class="justify-content-center">
        <b-col md="8" lg="6">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <h1>Login</h1>
                <p class="text-muted">Sign In to your account</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-user"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <input
                    v-model="formModel.username"
                    v-validate="{required: true, max: 64}"
                    v-bind:class="{ 'is-invalid': errors.has('form.username') }"
                    name="username"
                    type="text"
                    class="form-control"
                    placeholder="Username">
                  <b-form-invalid-feedback>
                    {{ errors.first('form.username') }}
                  </b-form-invalid-feedback>
                </b-input-group>
                <b-input-group class="mb-4">
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
                <b-row>
                  <b-col cols="6">
                    <b-button type="submit" variant="primary" class="px-4">Login</b-button>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <b-button
                      :to="{ name: 'Reset' }"
                      variant="link" class="px-0">Forgot password?
                    </b-button>
                  </b-col>
                  <b-col cols="12" class="text-center mt-3">
                    <b-button
                      :to="{ name: 'Register' }"
                      variant="link" class="px-0">No account?  Sign up!
                    </b-button>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>
  export default {
    /**
     * The name of the page.
     */
    name: 'login-page',

    /**
     * The data that can be used by the page.
     *
     * @returns {Object} The view-model data.
     */
    data() {
      return {
        formModel: {
          username: null,
          password: null
        }
      }
    },

    /**
     * The methods the page can use.
     */
    methods: {
      validateForm(scope) {
        this.$validator.validateAll(scope).then((result) => {
          if (result) {
            this.$store.dispatch('user/login', this.formModel)
          }
        })
      }
    }
  }
</script>
