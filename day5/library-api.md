# Library API Design

## Books Resource Endpoints

- **List all books**
  - **Method:** `GET`
  - **Path:** `/books`
  - **Description:** Retrieves a complete list of all books in the library.
  - **Success Status:** `200 OK`

- **List books by a specific author**
  - **Method:** `GET`
  - **Path:** `/books?author=name`
  - **Description:** Retrieves a filtered list of books written by the author specified in the query parameter.
  - **Success Status:** `200 OK`

- **Get a single book**
  - **Method:** `GET`
  - **Path:** `/books/:id`
  - **Description:** Retrieves the details of a specific book by its unique ID.
  - **Success Status:** `200 OK`

- **Create a new book**
  - **Method:** `POST`
  - **Path:** `/books`
  - **Description:** Adds a newly published book to the library system.
  - **Example Request Body:** `{ "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "year": 1925 }`
  - **Success Status:** `201 Created`

- **Update an existing book**
  - **Method:** `PUT`
  - **Path:** `/books/:id`
  - **Description:** Replaces all details of an existing book based on its ID.
  - **Example Request Body:** `{ "title": "The Great Gatsby (Revised Edition)", "author": "F. Scott Fitzgerald", "year": 1926 }`
  - **Success Status:** `200 OK`

- **Delete a book**
  - **Method:** `DELETE`
  - **Path:** `/books/:id`
  - **Description:** Permanently removes a specific book from the library system by its ID.
  - **Success Status:** `204 No Content`

## Error Codes

- **400 Bad Request**
  - **Example:** Occurs if a user tries to `POST` a new book but forgets to include the required `"title"` field in the request body. The server rejects it because the data is incomplete or malformed.
- **404 Not Found**
  - **Example:** Occurs if a user makes a `GET` request to `/books/9999`, but there is no book with the ID of `9999` in the database. The server cannot find the requested resource.
