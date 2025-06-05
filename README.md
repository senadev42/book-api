# BookManage API with Nest

A NestJS-based book CRUD API with secure authentication, book management, and cover storage capabilities.

## Key Features

- JWT Authentication with SSH key signing
- PostgreSQL database integration
- MinIO object storage
- Swagger API documentation

## Project Structure

- `auth/`: Authentication logic and strategies
- `books/`: Book-related operations and permissions
- `config/`: Application configuration files
- `users/`: User entity and related logic
- `storage/`: MinIO storage service integration

### Getting Started

1. Clone the repository

```
git clone git@github.com:senadev42/book-api.git
```

2. Copy `.env.example` to `.env`

```
cp .env.example .env
```

Customize environment variables as needed/wanted

3. Run the application:

```bash
docker compose up
```

### Accessing Services

Once everything has finished setting and loading the various services and their UIs can be accessed at the following urls.

- **Swagger API**: http://localhost:3000/swagger
- **MinIO Console**: http://localhost:9001/
- **PgAdmin**: http://localhost:5050/browser/
