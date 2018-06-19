<template>
  <b-card>
    <b-btn class="float-right"
           variant="primary"
           :to="'/scraping/icos/' + ico.id + '/edit'"
           size="sm">Edit</b-btn>
    <h4>{{ico.name}}</h4>
    <p class="mb-2">Website: <a target="_blank" :href="ico.website">{{ico.website}}</a></p>
    <p class="mb-0">Created at: {{new Date(ico.timestamp).toISOString().split('T')[0]}}</p>
  </b-card>
</template>
<script>
  export default {
    name: "scraping-ico-item",
    props: {
      ico: {
        type: Object
      }
    }
  }
</script>
