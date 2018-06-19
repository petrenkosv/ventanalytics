## Get all users
`GET https://api.ventanalytics.ru/user/admin/getAll`
- require JWT
- require permission ADMIN
- request query
    - name {String}
    - status {Number} (default null)
- response
    - status (200, 405, 500)
    - error
    ```
    {
        error: ""
    }
    ```
    - success
    ```
    {
        message: "Users received successfully",
        data: [{User}, ...]
    }
    ```
    
## Get user by ID
`GET https://api.ventanalytics.ru/user/admin/get/:id`
- require JWT
- require permission ADMIN
- params
    - id - user ID
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
        message: "Profile was received successfully",
        data: {User}
    }
    ```
    
## Block user
`PUT https://api.ventanalytics.ru/user/admin/block/:id`
- require JWT
- require permission ADMIN
- params
    - id - user ID
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
        message: "User was blocked successfully",
        data: {User}
    }
    ```
    
## Unblock user
`PUT https://api.ventanalytics.ru/user/admin/unblock/:id`
- require JWT
- require permission ADMIN
- params
    - id - user ID
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
        message: "User was unblocked successfully",
        data: {User}
    }
    ```
    
## Add permission to user
`POST https://api.ventanalytics.ru/user/admin/permission`
- require JWT
- require permission ADMIN
- params
    - id - user ID
- request body
    - id - user ID
    - module {String}
    - expires_in {Date}
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
        message: "Permission was added successfully",
        data: {Permission}
    }
    ```

## Delete permission by ID
`DELETE https://api.ventanalytics.ru/user/admin/permission/:id`
- require JWT
- require permission ADMIN
- params
    - id - permission ID
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
        message: "Permission was removed successfully"
    }
    ```