## ICO object
```
{
    name    : "",   // Searching field
    website : "",   // Searching field
    resources: [],  // All sources that were scraped
    maininfo: {
        description : "", // Description from (icoDrops ||icoRating)
        intro       : "", // Intro (icoBench)
        about       : "", // About(icoBench)
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
        salePercent : -1, // (saleTokens/totalTokens), %
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
            title: ""  //job
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
        content     : "", // Features (icoRating)
        techDetails : "", // Technical details (icoRating)
    },
    bounty: {
        link    : "",
        scheme  : ""
    },
    wallets: {
        btc     : "",
        eth     : ""
    },
    milestones: [{ // from icoBazaar
        date    : "",
        content : ""
    }],
    distribution: "", // Token distribution from icoRating
    additionalLinks: { // from icoDrops
        'link-name': 'link-href'
    },
    screenShorts: {// from icoDrops
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
}
```

## Create new ICO 

## Update ICO 

## Get ICO by ID
`GET https://api.ventanalytics.ru/api/ico/:id`
- response
    - error
    ```
    {
        message: error
    }
    ```
    - success
    ```
    {
        message: "Successfully getting ICO",
        data: {...}
    }
    ```


## Sections
- maininfo
- finance
- dates
- team
- links
- features
- bounty
- wallets
- milestones
- distribution
- additionalLinks
- screenShorts
- rating

## Get ICOs by query
`GET https://api.ventanalytics.ru/api/ico/query?`
- query params
    - `fields=field1|field2|...`
        - `all` - return all fields with data
        - `maininfo || maininfo.description || ...`
        - `finance || finance.token || ...`
        - `team || team.members || ...`
        - `links || links.whitepaper || ...`
        - `dates || dates.preIcoStart || ...`
        - `features || features.content || ...`
        - `bounty || bounty.link || ...`
        - `wallets || wallets.eth || wallets.btc`
        - `rating || rating.icodrops || rating.icodrops.totalrate || ...`
        - `recources`
        - `milestones`
        - `distribution`
        - `additionalLinks`
        - `screenShorts`
    - `sort=`
        - `name || !name` (ASC || DESC)
        - `website || !website` (ASC || DESC)
        - `timestamp || !timestamp` (ASC || DESC)
    - `format=excelAPI|json` (default `json`)
    - `limit=100` (default 100)
    - `preicodatestart={"from":"2018-03-30","until":"2018-04-20"}`
    - `preicodateend={"from":"2018-03-30"}` (can be same us previous date)
    - `icodatestart={"until":"2018-04-20"}` (can be same us previous date)
    - `icodateend=` (can be same us previous date)
    - `name=ico name` (search same ico by name)
    - `website=ventanalytics.ru` (search same ico by website)
    - `country=` (string)
    - `region=` (Asia || Africa || Near East || Caribbean islands || Oceania || North America || South America || Central America || West Europe || East Europe || World)
    - `token=BTC` (token symbol)
    - `category=` (Blockchain service || Crypto || Energy || Finance || Game and VR || High tech || Insurance || Marketing || Security || Trading)
    - `tokentype=` (string)
    - `totaltokens=>100000 || totaltokens=<1000` (`<N` - less than N, `>N` - more than N)
    - `saletokens=>100000 || saletokens=<1000`
    - `salepercent=>100000 || salepercent=<1000`
    - `hardcap=>100000 || hardcap=<1000`
    - `softcap=>100000 || softcap=<1000`
- response
    - error
    ```
    {
        error: error
    }
    ```
    - success
    ```
    {
        message: "Successfully getting ICOs",
        data: [{...}, {...}]
    }
    ```