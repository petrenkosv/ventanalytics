## Github object
```
{
    orgName : "",
    orgLink : "",
    repos   : [{  // Top 3 repos by totalCommits
        link        : "",
        totalCommits    : -1,
        totalAdditions  : -1,
        totalDeletions  : -1,
        authors: [{ // Top 3 authors by changes
            name    : "",
            commits : -1,
            changes : -1,
            additions: -1,
            deletions: -1
        }, {...}, {...}],
    }, {...}, {...}]
}
```

## Get github by organization
`GET https://api.ventanalytics.ru/api/github/:org`
- params
    - org = string  // organization name from github
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
        message: "Information successfully received from github",
        data: {}
    }
    ```