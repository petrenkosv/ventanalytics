<template>
  <b-card>
    <h3>Market API</h3>
    <p>This endpoint returns market object.</p>
    <h5>Request</h5>
    <pre>
      <code>GET {{apiHost}}/api/market/:type/:site</code>
    </pre>
    <h5>Market object</h5>
    <pre>
      <code>{
  be1: {
    website : "https://be1.ru/stat/:site",
    traffic : {
      direct    : "",
      referrals : "",
      search    : "",
      social    : "",
      mail      : ""
    },
    indexing: {
      yandex  : "",
      google  : ""
    },
    referrals: [
      {
        name  : "",
        score : ""
      }
      ....
    ],
    social: [
      {
        name  : "",
        score : ""
      }
      ...
    ]
  },
  aprcy: {
    website : "https://a.pr-cy.ru/:site",
    statistic : {
      month : {
        visitors  : "",
        views     : ""
      },
      week  : {
        visitors  : "",
        views     : ""
      },
      day   : {
        visitors  : "",
        views     : ""
      }
    },
    social  : {
      total   : "",
      source  : [
        {
          name  : "",
          score : ""
        },
        ...
      ]
    }
  }
}</code>
    </pre>
    <h5>Parameters</h5>
    <b-table :hover="true"
             :striped="true"
             :bordered="true"
             :items="queryItems"
             :fields="parametersFields">
    </b-table>
    <h5>Response</h5>
    <h6>Success</h6>
    <pre>
      <code>{
  "message": "Market information successfully received",
  "data": { Market object }
}</code>
    </pre>
    <h6>Error</h6>
    <pre>
      <code>{
  "error": "Not Found"
}</code>
    </pre>
    <h5>Example</h5>
    <pre>
      <code>GET {{apiHost}}/api/market/all/rb.ru?access_token=e15fc312e53asac497a7d57cb39dd7e6e4bc2aab1c69db78c15874decb031f2a</code>
    </pre>
  </b-card>
</template>
<script>
  import Vue from 'vue';

  export default {
    name: 'api-page-market',
    data() {
      return {
        apiHost: Vue.config.API_LOCATION,
        parametersFields: [ {key: 'name'}, {key: 'type'}, {key: 'required'}, {key: 'description'} ],
        queryItems: [
          {name: 'access_token', type: 'String', required: true, description: 'API token for identify user and permission. The parameter sets in searching query.'},
          {name: ':type', type: 'String', required: true, description: 'Type of market for scraping. Available types: <ul class="pl-3 mb-0"><li><b>all</b></li><li><b>be1</b></li><li><b>aprcy</b></li></ul>'},
          {name: ':site', type: 'String', required: true, description: 'Site address without <ul class="pl-3 mb-0"><li><b>http://</b></li><li><b>https://</b></li></ul>'}
        ]
      }
    }
  }
</script>
