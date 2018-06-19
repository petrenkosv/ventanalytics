## User object
```
{
    id: '',
    name: '',
    email: '',
    username: '',
    status: '',
    settings: '',
    permissions: ['', ...],
    permissionsArray: [{...}, ...],
    created_at: Date,
    updated_at: Date,
    deleted_at: Date
}
```

## Create token API
`GET https://api.ventanalytics.ru/user/api-token/create`
- require JWT
- response
    - status (200, 401, 500)
    - error
    ```
    {
        error: ""
    }
    ```
    - success
    ```
    {
        message: "Successfully created token API",
        data: {
            tokens_api_attributes,
            history: {
                tokens_api_history_attributes
            }
        }
    }
    ```
    
## Get profile
`GET https://api.ventanalytics.ru/user`
- require JWT
- response
    - status (200, 401, 500)
    - error
    ```
    {
        error: ""
    }
    ```
    - success
    ```
    {
        message: "Profile was received successfully",
        data: {User}
    }
    ```
    
## Update profile
`PUT https://api.ventanalytics.ru/user/:id`
- require JWT
- params
    - id - user ID
- request body
    - name
    - email
    - username
- response
    - status (200, 401, 405, 500)
    - error
    ```
    {
        error: ""
    }
    ```
    - success
    ```
    {
        message: "Profile was updated successfully",
        data: {User}
    }
    ```
    
## Delete profile
`DELETE https://api.ventanalytics.ru/user`
- require JWT
- response
    - status (200, 401, 500)
    - error
    ```
    {
        error: ""
    }
    ```
    - success
    ```
    {
        message: "Profile was deleted successfully"
    }
    ```
    
## Change user password
`PUT https://api.ventanalytics.ru/user/:id/changePassword`
- require JWT
- params
    - id - user ID
- request body
    - password
- response
    - status (200, 401, 405, 500)
    - error
    ```
    {
        error: ""
    }
    ```
    - success
    ```
    {
        message: "Password was changed successfully"
    }
    ```