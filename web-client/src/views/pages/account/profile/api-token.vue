<template>
  <b-card>
    <div slot="header">
      <strong>API token</strong>
      <b-badge :variant="'success'" v-if="token && token.active">active</b-badge>
      <b-badge :variant="'danger'" v-else-if="token">not active</b-badge>
    </div>
    <b-btn v-if="token === null" :variant="'primary'" @click="createToken">Create token</b-btn>
    <dl v-else class="row mb-0">
      <dt class="col-sm-3">Token: </dt>
      <dd class="col-sm-9">{{token.token}}</dd>
      <dt class="col-sm-3">Valid until: </dt>
      <dd class="col-sm-9">{{new Date(token.valid_date).toISOString().split('T')[0]}}</dd>
      <dt class="col-sm-3">Available requests: </dt>
      <dd class="col-sm-9 mb-0">
        {{(token.limits - token.requests) + ' / ' + token.limits}}
        <b-btn variant="link"
               v-b-modal.modalApiTokenHistory
               size="sm">History</b-btn></dd>
    </dl>
    <TokenHistory :token="token ? token.token : ''"/>
  </b-card>
</template>
<script>
  import TokenHistory from './api-token-history';
  export default {
    name: 'account-api-token',
    components: {
      TokenHistory
    },
    props: {
      token: {
        type: Object,
        default: () => {}
      }
    },
    methods: {
      createToken() {
        this.$store.dispatch('account/createToken')
      }
    }
  }
</script>
