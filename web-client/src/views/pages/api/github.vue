<template>
  <b-card>
    <h3>Github API</h3>
    <p>This endpoint returns github object. Returns top 3 repositories by totalCommits that include top 3 authors by changes.</p>
    <h5>Request</h5>
    <pre>
      <code>GET {{apiHost}}/api/github/:orgName</code>
    </pre>
    <h5>Github object</h5>
    <pre><code>{
  orgName : "",
  orgLink : "",
  repos   : [
    {
      link           : "",
      totalCommits   : -1,
      totalAdditions : -1,
      totalDeletions : -1,
      authors: [
        {
          name      : "",
          commits   : -1,
          changes   : -1,
          additions : -1,
          deletions : -1
        }
        ...
      ],
    }
    ...
  ]
}</code></pre>
    <h5>Parameters</h5>
    <b-table :hover="true"
             :striped="true"
             :bordered="true"
             :items="categoryItems"
             :fields="parametersFields">
    </b-table>
    <h5>Response</h5>
    <h6>Success</h6>
    <pre>
      <code>{
  message: "Information successfully received from github",
  data: { Github object }
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
      <code>GET {{apiHost}}/api/github/vuejs?access_token=e15fc312e53asac497a7d57cb39dd7e6e4bc2aab1c69db78c15874decb031f2a</code>
    </pre>
  </b-card>
</template>
<script>
  import Vue from 'vue';

  export default {
    name: 'api-page-github',
    data() {
      return {
        apiHost: Vue.config.API_LOCATION,
        parametersFields: [ {key: 'name'}, {key: 'type'}, {key: 'required'}, {key: 'description'} ],
        categoryItems: [
          {name: 'access_token', type: 'String', required: true, description: 'API token for identify user and permission. The parameter sets in searching query.'},
          {name: ':orgName', type: 'String', required: false, description: 'Github organization name.'}
        ]
      }
    }
  }
</script>
