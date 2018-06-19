<template>
  <b-card>
    <h3>Social API</h3>
    <p>This endpoint returns social object.</p>
    <h5>Request</h5>
    <pre>
      <code>GET {{apiHost}}/api/social?{query}</code>
    </pre>
    <h5>Social object</h5>
    <pre>
      <code>{
  telegram : {
    follows : -1
  },
  twitter  : {
    follows : -1
  },
  facebook : {
    follows : -1
  },
  medium   : {
    follows : -1,
    posts   : -1
  },
  reddit   : {
    follows : -1
  },
  bitcointalk : {
    follows : -1
  }
}</code>
    </pre>
    <h6>Can return several object of social object</h6>
    <pre><code>{
  telegram : {
    telegram_chanelname_1: {
      follows : -1
    },
    telegram_chanelname_2: {
      follows : -1
    }
  },
  ...
}</code></pre>
    <h5>Parameters</h5>
    <b-table :hover="true"
             :striped="true"
             :bordered="true"
             :items="feedItems"
             :fields="parametersFields">
    </b-table>
    <h5>Response</h5>
    <h6>Success</h6>
    <pre>
      <code>{
  message: "Social data successfully received",
  data: { Social object }
}</code>
    </pre>
    <h6>Error</h6>
    <pre>
      <code>{
  error: "Not found"
}</code>
    </pre>
    <h5>Example</h5>
    <pre>
      <code>GET {{apiHost}}/api/github?
        format=excelAPI&
        telegram=@canel_1|@canel_2|...&
        twitter=name_1|name_2|...&
        facebook=name_1&
        medium=@name_1&
        reddit=name_1&
        bitcointalk=123456&
        access_token=e15fc312e53asac497a7d57cb39dd7e6e4bc2aab1c69db78c15874decb031f2a</code>
    </pre>
  </b-card>
</template>
<script>
  import Vue from 'vue';

  export default {
    name: 'api-page-feed',
    data() {
      return {
        apiHost: Vue.config.API_LOCATION,
        parametersFields: [ {key: 'name'}, {key: 'type'}, {key: 'required'}, {key: 'description'} ],
        feedItems: [
          {name: 'access_token', type: 'String', required: true, description: 'API token for identify user and permission. The parameter sets in searching query.'},
          {name: 'format', type: 'String', required: false, description: 'In witch format returns data. <ul class="pl-3 mb-0"><li><b>format=json</b> - [Default] - return data as JSON object</li><li><b>format=excelAPI</b> - return data as JSON object with depth = 1</li></ul>'},
          {name: 'telegram', type: 'String', required: false, description: 'Chanelname of telegram. Can be set more than one via <b>|</b>. Chanelname should contains <b>@</b> as first chart.'},
          {name: 'twitter', type: 'String', required: false, description: 'Twitter chanel name. Can be set more than one via <b>|</b>.'},
          {name: 'facebook', type: 'String', required: false, description: 'Facebook group. Can be set more than one via <b>|</b>.'},
          {name: 'medium', type: 'String', required: false, description: 'Medium group. Can be set more than one via <b>|</b>. Group should contains <b>@</b> as first chart.'},
          {name: 'reddit', type: 'String', required: false, description: 'Reddit group. Can be set more than one via <b>|</b>.'},
          {name: 'bitcointalk', type: 'String', required: false, description: 'Bitcointalk topic. Can be set more than one via <b>|</b>.'},
        ]
      }
    }
  }
</script>
