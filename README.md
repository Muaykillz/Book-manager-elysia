# Book Management API 📚

This is a Book Management API built using [Elysia](https://elysia.dev/), a lightweight and fast web framework for Node.js. The API provides endpoints for managing books and user authentication.

## Features

- 🔒 JWT-based authentication
- 📝 CRUD operations for books
- 👥 User registration and login
- 📖 Swagger documentation

## Endpoints

### Books

- **GET /books**: Retrieve all books
- **GET /books/:id**: Retrieve a book by its ID
- **POST /books**: Create a new book
- **PUT /books/:id**: Update a book by its ID
- **DELETE /books/:id**: Delete a book by its ID

### Users

- **POST /register**: Register a new user
- **POST /login**: Login a user

## Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/book-management-api.git
    cd book-management-api
    ```

2. Install dependencies:
    ```sh
    bun install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```env
    JWT_SECRET=your_jwt_secret
    PORT=8000
    ```

4. Start the server:
    ```sh
    bun run src/index.ts
    ```

The server will be running at `http://localhost:8000`.

## Usage

### Authentication

All book-related endpoints are protected and require a valid JWT token. You can obtain a token by registering and logging in a user.

### Swagger Documentation

Swagger documentation is available at `http://localhost:8000/swagger`.

## Credit

This project is inspired from [Mike Lopster](https://mikelopster.dev/posts/elysiajs-bun)