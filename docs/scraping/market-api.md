## Market object
```
{
    be1: { // https://be1.ru/stat/website
        website: "",
        traffic: {
            direct: "",
            referrals: "",
            search: "",
            social: "",
            mail: ""
        },
        indexing: {
            yandex: "",
            google: ""
        },
        referrals: [{
            name: "",
            score: ""
        }, ...], // Top 5
        social: [{
            name: "",
            score: ""
        }, ...]  // Top 5
    },
    aprcy: { // https://a.pr-cy.ru/website
        website: "",
        statistic: {
            month: {
                visitors: -1,
                views: -1
            },
            week: {
                visitors: -1,
                views: -1
            },
            day: {
                visitors: -1,
                views: -1
            }
        },
        social: {
            total: -1,
            source: [{
                name: "",
                score: ""
            }, ...]
        }
    }
}
```

## Get market data by website and type
`GET https://api.ventanalytics.ru/api/market/:type/:site`
- params
    - type = (all || be1 || aprcy)
    - site = string
- response
    - error
    ```
    {
        status: 0,
        message: error
    }
    ```
    - success
    ```
    {
        status: 1,
        message: "Information successfully received from market",
        data: {}
    }
    ```