# Teamgrow backend_admin

## How to run
### Dev  
`npm run start:dev`
### Production
`npm start`
### Required Env Variables

Set these env variables in `/var/www/teamgrow/bakend_admin`.
Files, docs, db, test db are stored in the following paths defined in `config/path`.

```
  module.exports.FILES_PATH = '/var/www/teamgrow/files/'
  module.exports.ENV_PATH = '/var/www/teamgrow/teamgrow_env'
```

#### PORT=3000

## Endpoints

### Sign Up. 
   
  POST `/api/user`  
   
  Body: 
  ```
  {
    "email": "user@email.com",
    "user_name": "user",
    "password": "pwd"
    "time_zone": ""
    "cell_phone": "",
    "email_signature": "",
    "notification": "",
    "picture_profile":"http://localhost:3000/api/file/949b4d70-a48d-11e8-a12f-dd03f72627a4.png"
  }
  ```

  Response:  
  
  HTTP Status: 200
  ```
    {
        "status": true,
        "data": {
            "id": 2,
            "email": "test1@test.com",
            "user_name": "A",
            "time_zone": "America/Los_Angeles",
            "email_signature": "a",
            "notification": 1,
            "picture_profile": "http://localhost:3000/api/file/949b4d70-a48d-11e8-a12f-dd03f72627a4.png"
            "updatedAt": "2019-02-21T14:38:33.188Z",
            "createdAt": "2019-02-21T14:38:33.188Z"
        }
    }
  ```

  HTTP Status: 500
  ```
    {
        "status": false,
        "error": [
            {
                "message": "email must be unique",
                "type": "unique violation",
                "path": "email",
                "value": "test1@test.com",
                "origin": "DB",
                "instance": {},
                "validatorKey": "not_unique",
                "validatorName": null,
                "validatorArgs": []
            }
        ]
    }
  ```

### Login.
   
   POST `/api/user/login`  
   
   Body: 
   ```
   {
       "email": // Email or user_name,
       "password": "pwd"
   }
   ```

   Response:

   HTTP Status: 200  
   ```
    {
        "status": true,
        "data": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE1MzQ0MzAwNzV9.ObSw3PxO03keexi6Lb7BXSXtbt8xmdoUhjFpSWbyj3w",
            "user": {
                "id": 1,
                "user_name": "A",
                "email": "test@test.com",
                "cell_phone": "1234567890",
                "time_zone": "GMT+0100",
                "email_signature": "a",
                "notification": 1,
                "picture_profile": "http://localhost:3000/api/file/949b4d70-a48d-11e8-a12f-dd03f72627a4.png",
                "createdAt": "2019-02-21T14:27:19.854Z",
                "updatedAt": "2019-02-21T14:27:19.854Z"
            }
        }
    }
   ```
   HTTP Status: 401  

   ```
    {
      "status": false,
      "error": "Invalid email or password!"
    }
   ``` 

### FollowUp APIs

#### POST `/api/follow`  
   
   Body: 
   ```
   {
       "due_date": "2019-02-21T14:27:19.854Z",
       "content": "a",
       "contact": "5c71a62d8e8bea5ba7da91d2"
   }
   ```

   Response:

   HTTP Status: 200  
   ```
    {
        "status": true,
        "data": [
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "contact": [],
                "_id": "5c71a62d8e8bea5ba7da91d2",
                "due_date": "2019-02-21T14:27:19.854Z",
                "status": "1",
                "updated_at": "2019-02-21T14:27:19.854Z",
                "created_at": "2019-02-21T14:27:19.854Z",
                "__v": 0
            },
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "contact": [],
                "_id": "5c71b47385cdc7641d41247f",
                "due_date": "2019-02-21T14:27:19.854Z",
                "status": "1",
                "updated_at": "2019-02-21T14:27:19.854Z",
                "created_at": "2019-02-21T14:27:19.854Z",
                "__v": 0
            },
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "contact": [],
                "_id": "5c71c2e2ea4bf27835d845c9",
                "due_date": "2019-02-21T14:27:19.854Z",
                "status": "1",
                "updated_at": "2019-02-21T14:27:19.854Z",
                "created_at": "2019-02-21T14:27:19.854Z",
                "__v": 0
            }
        ]
    }
   ```
   HTTP Status: 401  

   ```
    {
      "status": false,
      "error": "FollowUp doesn`t exist"
    }
   ``` 

#### GET `/api/follow`

    Response:

    HTTP Status: 200
    ```
    {
        "status": true,
        "data": [
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "contact": [],
                "_id": "5c71a62d8e8bea5ba7da91d2",
                "due_date": "2019-02-21T14:27:19.854Z",
                "status": "1",
                "updated_at": "2019-02-21T14:27:19.854Z",
                "created_at": "2019-02-21T14:27:19.854Z",
                "__v": 0
            },
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "contact": [],
                "_id": "5c71b47385cdc7641d41247f",
                "due_date": "2019-02-21T14:27:19.854Z",
                "status": "1",
                "updated_at": "2019-02-21T14:27:19.854Z",
                "created_at": "2019-02-21T14:27:19.854Z",
                "__v": 0
            }
        ]
    }

### Contact APIs

#### GET `/api/contact`

    Response:

    HTTP Status: 200
    ```
    {
        "status": true,
        "data": [
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "contact": [],
                "_id": "5c71a62d8e8bea5ba7da91d2",
                "due_date": "2019-02-21T14:27:19.854Z",
                "status": "1",
                "updated_at": "2019-02-21T14:27:19.854Z",
                "created_at": "2019-02-21T14:27:19.854Z",
                "__v": 0
            },
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "contact": [],
                "_id": "5c71b47385cdc7641d41247f",
                "due_date": "2019-02-21T14:27:19.854Z",
                "status": "1",
                "updated_at": "2019-02-21T14:27:19.854Z",
                "created_at": "2019-02-21T14:27:19.854Z",
                "__v": 0
            }
        ]
    }

    ```
    HTTP Status: 401  

    ```
    {
        "status": false,
        "error": "Contact doesn`t exist"
    }
    ``` 

#### POST `/api/contact`

    Response:

    HTTP Status: 200
    ```
    {
        "status": true,
        "data": [
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "contact": [],
                "_id": "5c71a62d8e8bea5ba7da91d2",
                "due_date": "2019-02-21T14:27:19.854Z",
                "status": "1",
                "updated_at": "2019-02-21T14:27:19.854Z",
                "created_at": "2019-02-21T14:27:19.854Z",
                "__v": 0
            },
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "contact": [],
                "_id": "5c71b47385cdc7641d41247f",
                "due_date": "2019-02-21T14:27:19.854Z",
                "status": "1",
                "updated_at": "2019-02-21T14:27:19.854Z",
                "created_at": "2019-02-21T14:27:19.854Z",
                "__v": 0
            }
        ]
    }

### Activity APIs

#### GET `/api/activity`

    Response:

    HTTP Status: 200
    ```
    {
        "status": true,
        "data": [
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "note": [],
                "email": [],
                "contact": [
                    "5c71a62d8e8bea5ba7da91d2"
                ],
                "_id": "5c729fbe861fe7dbeb4040bb",
                "content": "email",
                "updated_at": "2019-02-24T13:44:30.173Z",
                "created_at": "2019-02-24T13:44:30.173Z",
                "__v": 0
            },
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "note": [],
                "email": [],
                "contact": [
                    "5c71a62d8e8bea5ba7da91d2"
                ],
                "_id": "5c72a05049e4e3dd35401b55",
                "content": "email",
                "updated_at": "2019-02-24T13:46:56.347Z",
                "created_at": "2019-02-24T13:46:56.347Z",
                "__v": 0
            }
        ]
    }

    ```
    HTTP Status: 401  

    ```
    {
        "status": false,
        "error": "Activity doesn`t exist"
    }
    ``` 

#### POST `/api/activity`

    Response:

    HTTP Status: 200
    ```
    {
        "status": true,
        "data": [
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "note": [],
                "email": [],
                "contact": [
                    "5c71a62d8e8bea5ba7da91d2"
                ],
                "_id": "5c729fbe861fe7dbeb4040bb",
                "content": "email",
                "updated_at": "2019-02-24T13:44:30.173Z",
                "created_at": "2019-02-24T13:44:30.173Z",
                "__v": 0
            },
            {
                "user": [
                    "5c715b0fccf14717986c85dc"
                ],
                "note": [],
                "email": [],
                "contact": [
                    "5c71a62d8e8bea5ba7da91d2"
                ],
                "_id": "5c72a05049e4e3dd35401b55",
                "content": "email",
                "updated_at": "2019-02-24T13:46:56.347Z",
                "created_at": "2019-02-24T13:46:56.347Z",
                "__v": 0
            }
        ]
    }