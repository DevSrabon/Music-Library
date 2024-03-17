# Music Library

This is a music library system developed using Express.js, TypeScript, and PostgreSQL as the database. The system allows users to register, log in, add music albums, artists, and individual songs to the library. Authentication is token-based (JWT) and all API endpoints are protected with access tokens.

## Features

1.User Authentication:

- Users can register and log in securely.
- Passwords are hashed for security.
- Authentication is token-based using JWT.

2. Music Albums and Artists:

- Authentic users can add music albums to the library.
- Each album has a title, release year, and genre.
- Each album can have multiple artists, and each artists can have multiple album, utilizing a many-to-many relationship.

3. Songs:

- Authentic users can add individual songs to the library.
- Each song has a title, duration, and is associated with an album.

## Installation Steps

### Follow these steps to clone and set up starter project:

1. `Clone the project:` Open your terminal or command prompt and run the following command to clone the project repository:

```bash
git clone https://github.com/DevSrabon/Music-Library.git music-backend-server
```

2. `Navigate into the project directory:` Use the cd command to navigate into the project directory:

```bash
cd music-backend-server
```

3. `Install project dependencies:` Next, install the project dependencies by running the following command:

```bash
yarn install
```

- Create a `.env` file in the project root directory and set the DATABASE_URL environment variable. Replace the placeholders with your database connection details or your can copy from `.evn.example`:

```bash
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
BCRYPT_SALT_ROUNDS="10"
JWT_REFRESH_SECRET="refresh-secret"
JWT_SECRET="secret"
JWT_REFRESH_EXPIRES_IN="7d"
JWT_EXPIRES_IN="1d"
```

4. `Run project:` finally, run this project by using following command:

```bash
yarn dev
```

# Entity Relation Diagram

![alt text](https://github.com/DevSrabon/Music-Library/blob/[main]/music-erd.png?raw=true)

# Schemas

```bash
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS albums (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL UNIQUE,
        release_year VARCHAR(10) NOT NULL,
        genre VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS artists (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );


    CREATE TABLE IF NOT EXISTS album_artists (
        album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
        artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
        PRIMARY KEY (album_id, artist_id)
    );


    CREATE TABLE IF NOT EXISTS songs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL UNIQUE,
        duration INTERVAL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        album_id INTEGER NOT NULL,
        CONSTRAINT album_id_fk FOREIGN KEY (album_id) REFERENCES albums (id) ON DELETE CASCADE
    );
```

# Api Endpoints

## Authentication

- #### `POST /api/v1/auth/login:` Log in an existing user.

- Request Body

```bash
    {
    "email": "example@gmail.com",
    "password": "123456"
    }
```

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "User logged in successfully !",
    "data": {
        "accessToken": "jkhfOuidhiopxxxxx"
        }
    }
```

- #### `POST /api/v1/auth/refresh-token:` To retrive a new access token.

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "Refreshed access token",
    "data": {
        "accessToken": "eyJhbGciOiJIUzIxxxxx"
        }
    }
```

[Note: All Api Endpoint are protected except `POST /api/v1/v1/users`]()

- To Access Private routes Please add headers `Key:`authorization `value:` Bearer your Access token

## User

- #### `POST /api/v1/users:` Create a user for register.

- Request Body

```bash
    {
    "username": "example",
    "email": "example@gmail.com",
    "password": "123456"
    }
```

- Response Data

```bash
    {
    "statusCode": 201,
    "success": true,
    "message": "User created successfully",
    "data": {
        "id": 7,
        "username": "example",
        "email": "example@gmail.com",
        "created_at": "2024-03-17T04:42:37.192Z",
        "updated_at": "2024-03-17T04:42:37.192Z"
        }
    }
```

- #### `GET /api/v1/v1/users:` Get all users.

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "User fetched successfully",
    "meta": {
        "page": 1,
        "limit": 10,
        "total": "4"
    },
    "data": [
                {
                    "id": 4,
                    "username": "hridoy",
                    "email": "hridoy@gmail.com",
                    "created_at": "2024-03-16T05:31:43.497Z",
                    "updated_at": "2024-03-16T05:31:43.497Z"
                },
            ]
    }
```

- #### `PATCH /api/v1/users/:id:` Update a User

- Request Body

```bash
    {
    "username": "example updated",
    }
```

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "User updated successfully",
    "data": {
        "id": 3,
        "username": "example updated",
        "email": "example@gmail.com",
        "created_at": "2024-03-16T05:31:28.848Z",
        "updated_at": "2024-03-17T05:11:41.277Z"
        }
    }
```

- #### `DELETE /api/v1/users/:id:` Delete a User

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "User deleted successfully",
    "data": {
        "id": 8,
        "username": "new",
        "email": "new@gmail.com",
        "created_at": "2024-03-17T05:27:07.038Z",
        "updated_at": "2024-03-17T05:27:07.038Z"
    }
}
```

## Album

- #### `POST /api/v1/albums:` Create a album.

- Request Body

```bash
    {
    "artists_name": "Ariana Grande",
    "title": "Eternal Sunshine",
    "genre": "Pop R&B",
    "release_year": "2024"
    }
```

- Response Data

```bash
    {
    "statusCode": 201,
    "success": true,
    "message": "Album created successfully",
    "data": {
        "artist": {
            "id": 13,
            "name": "Ariana Grande",
            "created_at": "2024-03-17T05:51:00.506Z",
            "updated_at": "2024-03-17T05:51:00.506Z"
        },
        "id": 12,
        "title": "Eternal Sunshine",
        "release_year": "2024",
        "genre": "Pop R&B",
        "created_at": "2024-03-17T05:51:00.622Z",
        "updated_at": "2024-03-17T05:51:00.622Z"
        }
    }
```

- #### `GET /api/v1/v1/albums:` Get all albums.

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "Album fetched successfully",
    "meta": {
        "page": 1,
        "limit": 10,
        "total": "4"
    },
    "data": [
            {
                "id": 12,
                "title": "Eternal Sunshine",
                "genre": "Pop R&B",
                "release_year": "2024",
                "created_at": "2024-03-17T05:51:00.622Z",
                "updated_at": "2024-03-17T05:51:00.622Z",
                "artists": [
                    {
                        "id": 13,
                        "name": "Ariana Grande"
                    }
                ]
            },
            {
                "id": 11,
                "title": "Ashique",
                "genre": "hindi",
                "release_year": "2017",
                "created_at": "2024-03-16T15:13:47.997Z",
                "updated_at": "2024-03-16T15:13:47.997Z",
                "artists": [
                    {
                        "id": 1,
                        "name": "Srabon"
                    },
                ]
            },
        ]
    }
```

- #### `PATCH /api/v1/albums/:id:` Update a album

- Request Body

```bash
    {
    "artists_name":"srabon",
    "title":"my2",
    "release_year": "2018"
    }
```

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "album updated successfully",
    "data": {
        "id": 3,
        "albumname": "example updated",
        "email": "example@gmail.com",
        "created_at": "2024-03-16T05:31:28.848Z",
        "updated_at": "2024-03-17T05:11:41.277Z"
        }
    }
```

- #### `DELETE /api/v1/albums/:id:` Delete a album

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "Album updated successfully",
    "data": {
        "id": 3,
        "title": "my2",
        "release_year": "2018",
        "genre": "lofi",
        "created_at": "2024-03-16T09:34:34.844Z",
        "updated_at": "2024-03-17T06:12:58.380Z",
        "artists_name": "srabon"
        }
    }
```

## Artists

- #### `POST /api/v1/artists:` Create an artist.

- Request Body

```bash
    {
    "name":"jackson",
    "album_id":12
    }
```

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "Artist created successfully",
    "data": {
        "album_id": 12,
        "artist_id": 16
        }
    }
```

- #### `GET /api/v1/v1/artists:` Get all artists.

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "Artists fetched successfully",
    "meta": {
        "page": 1,
        "limit": 10,
        "total": "7"
    },
    "data": [
            {
                "id": 16,
                "name": "jackson",
                "created_at": "2024-03-17T06:25:21.864Z",
                "updated_at": "2024-03-17T06:25:21.864Z",
                "albums": [
                    {
                        "id": 15,
                        "genre": "Pop R&B",
                        "title": "Eternal Sunshine4",
                        "created_at": "2024-03-17T06:17:51.708074+00:00",
                        "updated_at": "2024-03-17T06:17:51.708074+00:00",
                        "release_year": "2024"
                    },
                    {
                        "id": 12,
                        "genre": "Pop R&B",
                        "title": "Eternal Sunshine",
                        "created_at": "2024-03-17T05:51:00.622357+00:00",
                        "updated_at": "2024-03-17T05:51:00.622357+00:00",
                        "release_year": "2024"
                    }
                ]
            },
            {
                "id": 15,
                "name": "srabon",
                "created_at": "2024-03-17T06:05:43.627Z",
                "updated_at": "2024-03-17T06:05:43.627Z",
                "albums": [
                    {
                        "id": 3,
                        "genre": "lofi",
                        "title": "my2",
                        "created_at": "2024-03-16T09:34:34.844294+00:00",
                        "updated_at": "2024-03-17T06:16:22.178487+00:00",
                        "release_year": "2022"
                    }
                ]
            },
        ]
    }
```

- #### `PATCH /api/v1/users/:id:` Update an artist

- Request Body

```bash
    {
    "name":"srabon update artist"
    }
```

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "Artist updated successfully",
    "data": {
        "id": 3,
        "name": "srabon update artist",
        "created_at": "2024-03-16T15:31:08.161Z",
        "updated_at": "2024-03-16T15:31:08.161Z"
        }
    }
```

- #### `DELETE /api/v1/artists/:id:` Delete an artist

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "Artist deleted successfully",
    "data": {
        "id": 19,
        "name": "tesint",
        "created_at": "2024-03-17T07:01:48.475Z",
        "updated_at": "2024-03-17T07:01:48.475Z"
        }
    }
```

## Songs

- #### `POST /api/v1/songs:` Create a song.

- Request Body

```bash
    {
    "title": "tumi robe nirobe",
    "duration": "00:04:00",
    "album_id": 17
    }
```

- Response Data

```bash
   {
    "statusCode": 201,
    "success": true,
    "message": "song created successfully",
    "data": {
        "id": 8,
        "title": "tumi robe nirobe",
        "duration": {
            "minutes": 4
        },
        "created_at": "2024-03-17T07:17:42.557Z",
        "updated_at": "2024-03-17T07:17:42.557Z",
        "album_id": 17
        }
    }
```

- #### `GET /api/v1/v1/songs:` Get all Songs.

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "Songs fetched successfully",
    "meta": {
        "page": 1,
        "limit": 10,
        "total": "5"
    },
    "data": [
            {
                "id": 9,
                "title": "Amar Sonar Bangla",
                "duration": {
                    "minutes": 4
                },
                "created_at": "2024-03-17T07:20:30.559Z",
                "updated_at": "2024-03-17T07:20:30.559Z",
                "albums": [
                    {
                        "id": 17,
                        "genre": "Pop R&B",
                        "title": "Old Song",
                        "created_at": "2024-03-17T07:17:18.398276+00:00",
                        "updated_at": "2024-03-17T07:17:18.398276+00:00",
                        "release_year": "1946"
                    }
                ],
                "artists": [
                    {
                        "id": 22,
                        "name": "Robindro Nath Thakur",
                        "created_at": "2024-03-17T07:17:18.281001+00:00",
                        "updated_at": "2024-03-17T07:17:18.281001+00:00"
                    }
                ]
            },

            ]
        }
```

- #### `PATCH /api/v1/users/:id:` Update an artist

- Request Body

```bash
    {
    "title": "amar sonar bangla"
    }
```

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "song updated successfully",
    "data": {
        "id": 9,
        "title": "amar sonar bangla",
        "duration": {
            "minutes": 4
        },
        "created_at": "2024-03-17T07:20:30.559Z",
        "updated_at": "2024-03-17T07:20:30.559Z",
        "album_id": 17
        }
    }
```

- #### `DELETE /api/v1/songs/:id:` Delete an artist

- Response Data

```bash
    {
    "statusCode": 200,
    "success": true,
    "message": "song deleted successfully",
    "data": {
        "id": 5,
        "title": "tmi ",
        "duration": {
            "minutes": 3,
            "seconds": 30
        },
        "created_at": "2024-03-16T18:18:33.305Z",
        "updated_at": "2024-03-16T18:18:33.305Z",
        "album_id": 3
        }
    }
```

### Postman Api Documentation-[Click Here](https://documenter.getpostman.com/view/28172278/2sA2xnxVb6)

# Contributor

[SRABON BARUA](https://github.com/DevSrabon)

Happy coding!
