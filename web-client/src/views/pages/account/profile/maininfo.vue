<template>
  <form @submit.prevent="validateForm('accountMainInfoForm')" data-vv-scope="accountMainInfoForm">
    <b-card>
      <div slot="header">
        <strong>Profile info</strong>
      </div>
      <b-form-group label="Name"
                    label-for="accountName"
                    :label-cols="3"
                    :horizontal="true">
        <b-form-input id="accountName"
                      type="text"
                      name="name"
                      autocomplete="off"
                      v-model="account.name"
                      v-validate="{required: true, max: 128}"
                      v-bind:class="{ 'is-invalid': errors.has('accountMainInfoForm.name') }"></b-form-input>
        <b-form-invalid-feedback>
          {{ errors.first('accountMainInfoForm.name') }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Username"
                    label-for="accountUserName"
                    :label-cols="3"
                    :horizontal="true">
        <b-form-input id="accountUserName"
                      type="text"
                      name="username"
                      autocomplete="off"
                      v-model="account.username"
                      v-validate="{required: true, max: 64}"
                      v-bind:class="{ 'is-invalid': errors.has('accountMainInfoForm.username') }"></b-form-input>
        <b-form-invalid-feedback>
          {{ errors.first('accountMainInfoForm.username') }}
        </b-form-invalid-feedback>
      </b-form-group>
      <b-form-group label="Email"
                    label-for="accountEmail"
                    :label-cols="3"
                    :horizontal="true">
        <b-form-input id="accountEmail"
                      type="email"
                      name="email"
                      autocomplete="off"
                      v-model="account.email"
                      v-validate="{required: true, email: true, max: 128}"
                      v-bind:class="{ 'is-invalid': errors.has('accountMainInfoForm.email') }"></b-form-input>
        <b-form-invalid-feedback>
          {{ errors.first('accountMainInfoForm.email') }}
        </b-form-invalid-feedback>
        <span class="badge" :class="this.setStatus(account.status).class">
          {{this.setStatus(account.status).text}}
        </span>
      </b-form-group>
      <div slot="footer">
        <b-btn type="submit" size="sm" variant="primary" class="float-right">Update</b-btn>
        <b-btn type="button"
               v-if="account.id === this.$store.state.account.id"
               size="sm" variant="danger" v-b-modal.modalDeleteAccountPrevent>Delete account</b-btn>
        <b-btn type="button"
               v-else-if="account.id !== this.$store.state.account.id && account.status !== 2"
               size="sm" variant="danger" v-b-modal.modalBlockAccountPrevent>Block account</b-btn>
        <b-btn type="button"
               v-else-if="account.id !== this.$store.state.account.id && account.status === 2"
               size="sm" variant="success" @click="unBlockAccount">Unblock account</b-btn>
      </div>
    </b-card>
    <b-modal v-if="account.id === this.$store.state.account.id"
             id="modalDeleteAccountPrevent"
             title="Are you sure?"
             @ok="deleteAccount"
             ok-title="Delete">
      If you delete account you will lose all your wont have access to application.
    </b-modal>
    <b-modal v-if="account.id !== this.$store.state.account.id && account.status !== 2"
             id="modalBlockAccountPrevent"
             title="Are you sure?"
             @ok="blockAccount"
             ok-title="Block">
      If you block account, user wont have access to application.
    </b-modal>
  </form>
</template>
<script>
  export default {
    name: 'account-page-maininfo',
    props: {
      account: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      validateForm(scope) {
        this.$validator.validateAll(scope).then((result) => {
          if (result) {
            this.$store.dispatch('account/updateProfile', this.account)
          }
        })
      },
      deleteAccount() {
        this.$store.dispatch('account/deleteAccount')
      },
      blockAccount() {
        this.$store.dispatch('adminUsers/blockAccount', this.account.id)
      },
      unBlockAccount() {
        this.$store.dispatch('adminUsers/unBlockAccount', this.account.id)
      },
      setStatus(status) {
        status = status || 0;
        switch (status) {
          case 0:
            return {class: 'badge-warning', text: 'Not confirmed'};
          case 1:
            return {class: 'badge-primary', text: 'Confirmed'};
          case 2:
            return {class: 'badge-danger', text: 'Blocked'};
          case 3:
            return {class: 'badge-danger', text: 'Deleted'};
        }
      }
    }
  }
</script>
