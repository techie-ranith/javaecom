# Aurelia Perfume Store API

Production-oriented Spring Boot backend for a fictional premium perfume store.
The API uses Java 21, Spring Boot 4, Spring Web MVC, Spring Data JPA, Spring
Security, JWT, BCrypt, Bean Validation, Lombok, Maven, and MySQL.

## Architecture

The application is organized into:

- `controller`: REST endpoints and request validation
- `service`: catalog, customer, authentication, and administration business logic
- `repository`: Spring Data persistence interfaces
- `entity`: JPA domain model and relationships
- `dto` and `mapper`: API contracts and entity-to-response mapping
- `security`: JWT filter, token service, password encoding, and authorization
- `exception`: consistent `ApiResponse` error handling
- `config`: development seed data

Controllers return DTOs wrapped in:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

## Setup

1. Create a MySQL database user with permission to create/update the
   `perfume_store` schema.
2. Set the environment variables below.
3. Start the application:

```powershell
.\mvnw.cmd spring-boot:run
```

The default port is `8080`. Hibernate uses `update` by default for local
development; use migrations and a safer schema policy in production.

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `DB_URL` | `jdbc:mysql://localhost:3306/perfume_store?createDatabaseIfNotExist=true&serverTimezone=UTC` | JDBC URL |
| `DB_USERNAME` | `root` | MySQL username |
| `DB_PASSWORD` | empty | MySQL password |
| `JWT_SECRET` | development placeholder | Secret of at least 32 characters |
| `JWT_EXPIRATION` | `86400000` | Token lifetime in milliseconds |
| `DDL_AUTO` | `update` | Hibernate schema mode |
| `SEED_ENABLED` | `true` | Enable fictional development seed data |

Never use the default JWT secret or development passwords in production.

## Development credentials

When seeding is enabled:

- Admin: `admin@aurelia.test` / `Admin@123`
- Customer: `maya@aurelia.test` / `Customer@123`
- Additional customers: `noah@aurelia.test`, `iris@aurelia.test`

## API overview

### Public

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/products/{id}/reviews`
- `GET /api/categories`

Product browsing supports `q`, `category`, `gender`, `minPrice`, `maxPrice`,
`featured`, pagination, and Spring `sort` parameters.

### Customer

Send `Authorization: Bearer <jwt>` after login.

- `GET /api/cart`
- `POST /api/cart/items?productId=1&quantity=1`
- `PUT /api/cart/items/{id}?quantity=2`
- `DELETE /api/cart/items/{id}`
- `GET /api/wishlist`
- `POST /api/wishlist/{productId}`
- `DELETE /api/wishlist/{productId}`
- `POST /api/orders?address=...&phone=...&payment=...`
- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/reviews/{productId}`

Reviews are upserted per customer and product, so a customer can update an
existing review rather than creating duplicates.

### Admin

Admin JWTs can access:

- `GET /api/admin/dashboard`
- `GET /api/admin/sales`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/{id}/status?status=CONFIRMED`
- `GET /api/admin/customers`
- Product, category, and coupon CRUD under `/api/admin`

Order statuses are `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`,
`DELIVERED`, and `CANCELLED`.

## Validation

With the available JDK 17 runtime, compile and test compilation can be run with:

```powershell
.\mvnw.cmd -q -DskipTests -Dmaven.compiler.release=17 test
```

The application targets Java 21. The context test requires a reachable MySQL
instance configured through `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`.
