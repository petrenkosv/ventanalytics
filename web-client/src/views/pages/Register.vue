<template>
  <form class="app flex-row align-items-center" @submit.prevent="validateForm('form')" data-vv-scope="form">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8" lg="6">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <h1>Register</h1>
              <p class="text-muted">Create your account</p>
              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-user"></i></b-input-group-text>
                </b-input-group-prepend>
                <input
                  v-model="formModel.name"
                  v-validate="{required: true, max: 128}"
                  v-bind:class="{ 'is-invalid': errors.has('form.name') }"
                  name="name"
                  type="text"
                  class="form-control"
                  placeholder="Name">
                <b-form-invalid-feedback>
                  {{ errors.first('form.name') }}
                </b-form-invalid-feedback>
              </b-input-group>

              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-login"></i></b-input-group-text>
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

              <b-button type="submit" variant="success" block>Create Account</b-button>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </form>

</template>

<script>
  export default {
    /**
     * The name of the page.
     */
    name: 'register-page',

    /**
     * The data that can be used by the page.
     *
     * @returns {Object} The view-model data.
     */
    data() {
      return {
        formModel: {
          name: null,
          username: null,
          email: null,
          password: null,
          repeat_password: null
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
            this.$store.dispatch('user/register', this.formModel)
          }
        })
      }
    }
  }
</script>
