## JWT auth (access + refresh tokens)
- When user sign in he should set in headers tokens (depends on request)
```
Authorization   bearer 'access_token'
Authorization   bearer 'refresh_token'
```
- Each JWT request check access_token on valid exp date. 
- If access_token is valid set to headers `user: { id: uuid, permissions: [] } `.
- If not valid - return Unauthorised (401)
- On client before make a request check access_token exp date
- If not valid => make request for getting new tokens
- Repeat first request 


## Sign up
`POST https://api.ventanalytics.ru/auth/signup`
- body
    - name
    - username
    - email
    - password
- response
    - status (200, 400, 500)
    - error
    ```
    {
        error: ""
    }
    ```
    - success
    ```
    {
        message: "Success sign up. Confirmation link send to email"
    }
    ```
    
## Sign in
`POST https://api.ventanalytics.ru/auth/signin`
- body
    - username
    - password
- response
    - status (200, 400, 500)
    - error
    ```
    {
        error: ""
    }
    ```
    - success
    ```
    {
        message: "Successfully sign in",
        data: {
            access_token: "",
            refresh_token: ""
        }
    }
    ```
    
## Recovery password
`POST https://api.ventanalytics.ru/auth/recovery`
- body
    - email
    - recaptcha
- response
    - status (200, 400, 500)
    - error
    ```
    {
        error: ""
    }
    ```
    - success
    ```
    {
        message: "Success recovery. Reset link send to email"
    }
    ```
    
## Reset password
`POST https://api.ventanalytics.ru/auth/reset?hash=`
- body
    - password
- query
    - hash
- response
    - status (200, 400, 500)
    - error
    ```
    {
        error: ""
    }
    ```
    - success
    ```
    {
        message: "Successfully reset password",
        data: {
            access_token: "",
            refresh_token: ""
        }
    }
    ```
    
## Confirmation email
`GET https://api.ventanalytics.ru/auth/confirm?hash=`
- query
    - hash
- response
    - status (200, 400, 500)
    - error
    ```
    {
        error: ""
    }
    ```
    - success
    ```
    {
        message: "Successfully confirm email",
        data: {
            access_token: "",
            refresh_token: ""
        }
    }
    ```
    
    
## Refresh tokens	
-`GET https://api.ventanalytics.ru/auth/refresh-token`	
- The request call when access_token is expired. 	
- headers	
    - refresh_token	
- response	
    - status (200, 400, 401)	
    - error
    ```
    {	
        error: ""	
    }	
    ```	
    - success	
    ```	
    {	
        access_token: "",	
        refresh_token: ""	
    }