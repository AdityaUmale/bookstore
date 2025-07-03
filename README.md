# Bookstore API

A simple Node.js + Express + TypeScript REST API for user authentication and book management with JWT-based authentication.

---

## Setup Instructions

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd bookstore
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Create a `.env` file in the project root:**
   ```env
   JWT_SECRET=your_super_secret_key
   ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   The server will start on `http://localhost:3000`.

---

## How to Test Endpoints

You can use **Postman**, **Insomnia**, or **curl** to test the API endpoints.

### Register a User
- **POST** `/auth/register`
- **Body (JSON):**
  ```json
  {
    "name": "Alice",
    "email": "alice@example.com",
    "password": "password123"
  }
  ```

### Login
- **POST** `/auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "alice@example.com",
    "password": "password123"
  }
  ```
- **Response:** Returns a JWT token.

### Authenticated Endpoints
For all book endpoints, include the JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

### Create a Book
- **POST** `/book/create`
- **Body (JSON):**
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "genre": "Fiction",
    "publishedYear": 2024
  }
  ```

### Get All Books (for logged-in user)
- **GET** `/book/books`

### Get Book by ID
- **GET** `/book/books/:id`

### Update a Book
- **PUT** `/book/books/:id`
- **Body (JSON):**
  ```json
  {
    "title": "Updated Title",
    "author": "Updated Author",
    "genre": "Non-Fiction",
    "publishedYear": 2025
  }
  ```

### Delete a Book
- **DELETE** `/book/books/:id`

---

## API Documentation

### Authentication
- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and receive a JWT token

### Books (Protected)
- `POST /book/create` — Create a new book (requires JWT)
- `GET /book/books` — Get all books for the logged-in user
- `GET /book/books/:id` — Get a specific book by ID
- `PUT /book/books/:id` — Update a book (only by owner)
- `DELETE /book/books/:id` — Delete a book (only by owner)

### Error Handling
- Returns `404` for unknown routes
- Returns `401` for unauthorized access
- Returns `403` if trying to update/delete a book you do not own
- Returns `500` for server errors

---

## Notes
- All data is stored in local JSON files (no database required).
- JWT secret should be kept safe and not hardcoded in production. 