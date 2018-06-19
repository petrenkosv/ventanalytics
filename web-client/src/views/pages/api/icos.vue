<template>
  <b-card>
    <h3>ICOs API</h3>
    <p>This endpoint returns array of ICOs object with selecting fields.</p>
    <h5>Request</h5>
    <pre>
      <code>GET {{apiHost}}/api/ico/query?{parameters}</code>
    </pre>
    <h5>ICO object</h5>
    <pre>
      <code>{
    name    : "",   // Searching field
    website : "",   // Searching field
    resources: [],  // All sources that were scraped
    maininfo: {
        description : "",
        intro       : "",
        about       : "",
        country     : "",
        region      : "",
        company     : ""
    },
    finance: {
        token       : "", // Ticker symbol
        category    : "", // ICO type
        tokenType   : "", // Token type
        totalTokens : -1,
        saleTokens  : -1,
        salePercent : -1, // (saleTokens/totalTokens)
        price       : -1, // Price of 1 token in USD
        accepting   : "",
        tokensRole  : "",
        dividends   : "",
        emission    : "",
        escrow      : "",
        totalMoney  : -1,
        hardcap     : -1,
        softcap     : -1,
        distributed : -1,
        bonus       : false,
        platform    : ""
    },
    dates: {
        preIcoStart     : "",
        preIcoEnd       : "",
        icoStart        : "",
        icoEnd          : "",
        durationIco     : -1, // in weeks
        durationPreIco  : -1, // in weeks
    },
    team: {
        members : [{
            name:  "",
            link:  "", // to linkedin
            title: ""  // job
        }, {...}],
        from    : "", // Country
        size    : -1, // Number of team members
    },
    links: {
        whitepaper  : "",
        twitter     : "",
        telegram    : "",
        medium      : "",
        slack       : "",
        reddit      : "",
        linkedin    : "",
        facebook    : "",
        github      : "",
        crunchbase  : "",
        bitcointalk : "",
        youtube     : ""
    },
    features: {
        content     : "",
        techDetails : "",
    },
    bounty: {
        link    : "",
        scheme  : ""
    },
    wallets: {
        btc     : "",
        eth     : ""
    },
    milestones: [{
        date    : "",
        content : ""
    }],
    distribution: "",
    additionalLinks: {
        'link-name': 'link-href'
    },
    screenShorts: {
        'link-name': 'link-href'
    },
    rating: {
        icodrops : {
            totalrate   : "",
            hyperate    : "",
            riskrate    : "",
            roirate     : ""
        },
        icobench : {
            total       : "",
            profile     : "",
            team        : "",
            vision      : "",
            product     : ""
        },
        icobazaar : {
            total       : "",
            site        : "",
            team        : "",
            idea        : "",
            media       : "",
            technology  : ""
        },
        icorating : {
            investment  : "",
            hypescore   : "",
            riskscore   : ""
        },
        ventanalytics: {
            p_hardcap: -1
        }
    },
    timestamp : ""
}</code>
    </pre>
    <h5>Parameters</h5>
    <p>Parameters set in searching query.</p>
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
  "message": "Successfully getting ICOs",
  "data": { ICO object with sets fields }
}</code>
    </pre>
    <h6>Error</h6>
    <pre>
      <code>{
  "error": "Not valid query"
}</code>
    </pre>
    <h5>Example</h5>
    <pre>
      <code>GET {{apiHost}}/api/ico/query?
        fields=maininfo|dates.icoStart|rating.icodrops|...&
        sort=timestamp&
        limit=100&
        name=Ethereium&
        website=https://www.ethereum.org&
        token=ETH&
        tokentype=ERC-20&
        country=USA&
        region=North America&
        category=Crypto&
        preicodatestart={"from":"2018-03-30","until":"2018-04-20"}&
        preicodateend={"from":"2018-03-30"}&
        icodatestart={"from":"2018-03-30"}&
        icodateend={"until":"2018-04-20"}&
        totaltokens=>100000&
        saletokens=<1000&
        salepercent<0.8&
        hardcap=<1000&
        softcap>100000&
        access_token=e15fc312e53asac497a7d57cb39dd7e6e4bc2aab1c69db78c15874decb031f2a</code>
    </pre>
  </b-card>
</template>
<script>
  import Vue from 'vue';

  export default {
    name: 'api-page-icos',
    data() {
      return {
        apiHost: Vue.config.API_LOCATION,
        parametersFields: [ {key: 'name'}, {key: 'type'}, {key: 'required'}, {key: 'description'} ],
        queryItems: [
          {name: 'access_token', type: 'String', required: true, description: 'API token for identify user and permission. The parameter sets in searching query.'},
          {name: 'fields', type: 'String', required: true, description: 'Fields if category. Can be set more that one throw <b>|</b>.' +
            '<ul class="pl-3 mb-0">' +
            '<li><b>all</b></li>' +
            '<li><b>maininfo | maininfo.description | ...</b></li>' +
            '<li><b>finance | finance.token | ...</b></li>' +
            '<li><b>team | team.members | ...</b></li>' +
            '<li><b>links | links.whitepaper | ...</b></li>' +
            '<li><b>dates | dates.preIcoStart | ...</b></li>' +
            '<li><b>features | features.content | ...</b></li>' +
            '<li><b>wallets | wallets.eth | wallets.btc</b></li>' +
            '<li><b>rating | rating.icodrops | rating.icodrops.totalrate | ...</b></li>' +
            '<li><b>recources</b></li>' +
            '<li><b>milestones</b></li>' +
            '<li><b>distribution</b></li>' +
            '<li><b>additionalLinks</b></li>' +
            '<li><b>screenShorts</b></li>' +
            '</ul>'},
          {name: 'sort', type: 'String', required: false, description: 'Sorting order. Default sort by ID.' +
            '<ul class="pl-3 mb-0">' +
            '<li><b>sort=name</b> - ASC sorting by name</li>' +
            '<li><b>sort=!name</b> - DESC sorting by name</li>' +
            '<li><b>sort=website</b> - ASC sorting by website</li>' +
            '<li><b>sort=!website</b> - DESC sorting by website</li>' +
            '<li><b>sort=timestamp</b> - ASC sorting by timestamp</li>' +
            '<li><b>sort=!timestamp</b> - DESC sorting by timestamp</li>' +
            '</ul>'},
          {name: 'format', type: 'String', required: false, description: 'In witch format returns data.' +
            '<ul class="pl-3 mb-0">' +
            '<li><b>format=json</b> - [Default] - return data as JSON object</li>' +
            '<li><b>format=excelAPI</b> - return data as JSON object with depth = 1</li>' +
            '</ul>'},
          {name: 'limit', type: 'Number', required: false, description: 'List of the ICOs with setting limit in searching query. Default: 100.'},
          {name: 'name', type: 'String', required: false, description: 'Searching ICOs with same name.'},
          {name: 'website', type: 'String', required: false, description: 'Searching ICOs with same website.'},
          {name: 'token', type: 'String', required: false, description: 'Searching ICOs by token symbol.'},
          {name: 'tokentype', type: 'String', required: false, description: 'Searching ICOs by token type.'},
          {name: 'country', type: 'String', required: false, description: 'Searching ICOs by country name.'},
          {name: 'region', type: 'String', required: false, description: 'Searching ICOs by region name. Available regions:' +
            '<ul class="pl-3 mb-0">' +
            '<li><b>Asia</b></li>' +
            '<li><b>Africa</b></li>' +
            '<li><b>Near East</b></li>' +
            '<li><b>Caribbean islands</b></li>' +
            '<li><b>Oceania</b></li>' +
            '<li><b>North America</b></li>' +
            '<li><b>South America</b></li>' +
            '<li><b>Central America</b></li>' +
            '<li><b>West Europe</b></li>' +
            '<li><b>East Europe</b></li>' +
            '<li><b>World</b></li>' +
            '</ul>'},
          {name: 'category', type: 'String', required: false, description: 'Searching ICOs by category. Available categories:' +
            '<ul class="pl-3 mb-0">' +
            '<li><b>Blockchain service</b></li>' +
            '<li><b>Crypto</b></li>' +
            '<li><b>Energy</b></li>' +
            '<li><b>Finance</b></li>' +
            '<li><b>Game and VR</b></li>' +
            '<li><b>High tech</b></li>' +
            '<li><b>Insurance</b></li>' +
            '<li><b>Marketing</b></li>' +
            '<li><b>Security</b></li>' +
            '<li><b>Trading</b></li>' +
            '</ul>'},
          {name: 'preicodatestart', type: 'JSON', required: false, description: 'Pre ICO start date. Sets in format: <code>{"from":"2018-03-30","until":"2018-04-20"}</code>.'},
          {name: 'preicodateend', type: 'JSON', required: false, description: 'Pre ICO end date. Sets in format like previous date or <code>{"from":"2018-03-30"}</code>.'},
          {name: 'icodatestart', type: 'JSON', required: false, description: 'ICO start date. Sets in format like previous dates or: <code>{"until":"2018-04-20"}</code>.'},
          {name: 'icodateend', type: 'JSON', required: false, description: 'ICO end date. Sets in format like previous dates.'},
          {name: 'totaltokens', type: 'Number', required: false, description: 'Get ICOs where is total tokens with filters:' +
            '<ul class="pl-3 mb-0">' +
            '<li><b><=N</b> means less or equal N</li>' +
            '<li><b> < N </b> means less than N</li>' +
            '<li><b>>=N</b> means more or equal N</li>' +
            '<li><b>>N</b> means more than N</li>' +
            '</ul>' +
            'Example: <code>totaltokens=>100000   or   totaltokens=<1000</code>'},
          {name: 'saletokens', type: 'Number', required: false, description: 'Get ICOs where is sale tokens with filters that describe in totaltokens description. Example: <code>saletokens=>100000   or   saletokens=<1000</code>'},
          {name: 'salepercent', type: 'Number', required: false, description: 'Get ICOs where is sale percent with filters that describe in totaltokens description. Example: <code>salepercent=>0.1   or   salepercent=<0.8</code>'},
          {name: 'hardcap', type: 'Number', required: false, description: 'Get ICOs where is hardcap with filters that describe in totaltokens description. Example: <code>hardcap=>100000   or   hardcap=<1000</code>'},
          {name: 'softcap', type: 'Number', required: false, description: 'Get ICOs where is softcap with filters that describe in totaltokens description. Example: <code>softcap=>100000   or   softcap=<1000</code>'}
        ]
      }
    }
  }
</script>
