## Social object
```
{
    telegram : {
        'telegram_name_1' : {
            follows: -1
        },
        'telegram_name_2' : {
            follows: -1
        }
    },
    twitter : {
        follows: -1
    },
    facebook : {
        follows: -1
    },
    medium : {
        follows: -1,
        posts: -1
    },
    reddit : {
        follows: -1
    },
    bitcointalk : {
        follows: -1
    }
}
```

## Get social by query attributes
`GET https://api.ventanalytics.ru/api/social?`
- params
    - `format=excelAPI|json` (default `json`)
    - `telegram=@canel_1|@canel_2|...`
    - `twitter=name_1|name_2|...`
    - `facebook=name_1|name_2|...`
    - `medium=@name_1|@name_2|...`
    - `reddit=name_1|name_2|...`
    - `bitcointalk=123456|123457|...`
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
        message: "Social data successfully received",
        data: {}
    }
    ```