# Users CRUD Operations

Examples for managing users within an organization.

**Prerequisites:** You must be authenticated and have appropriate permissions.

## List Users

**Endpoint:** `GET /users`
**Auth Required:** Yes

### Basic Request
```bash
curl -X GET "http://localhost:3000/users" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### With Filters
```bash
curl -X GET "http://localhost:3000/users?search=john&role=manager&isActive=true&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "manager",
      "organizationId": "123e4567-e89b-12d3-a456-426614174001",
      "dealershipId": "123e4567-e89b-12d3-a456-426614174002"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

## Create User

**Endpoint:** `POST /users`
**Auth Required:** Yes (Admin/Manager only)

### Request
```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "SecurePass123!",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "sales",
    "dealershipId": "123e4567-e89b-12d3-a456-426614174002"
  }'
```

### Response (201 Created)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174003",
  "email": "jane.smith@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "sales",
  "organizationId": "123e4567-e89b-12d3-a456-426614174001",
  "dealershipId": "123e4567-e89b-12d3-a456-426614174002"
}
```

## Get Single User

**Endpoint:** `GET /users/{id}`
**Auth Required:** Yes

### Request
```bash
curl -X GET http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174003 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Response (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174003",
  "email": "jane.smith@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "sales",
  "organizationId": "123e4567-e89b-12d3-a456-426614174001",
  "dealershipId": "123e4567-e89b-12d3-a456-426614174002",
  "createdAt": "2025-01-20T18:50:02.457Z",
  "updatedAt": "2025-01-20T18:50:02.457Z"
}
```

## Update User

**Endpoint:** `PUT /users/{id}`
**Auth Required:** Yes (Admin/Manager only)

### Request
```bash
curl -X PUT http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174003 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Johnson",
    "role": "manager"
  }'
```

### Response (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174003",
  "email": "jane.smith@example.com",
  "firstName": "Jane",
  "lastName": "Johnson",
  "role": "manager",
  "organizationId": "123e4567-e89b-12d3-a456-426614174001",
  "dealershipId": "123e4567-e89b-12d3-a456-426614174002",
  "updatedAt": "2025-01-20T19:00:02.457Z"
}
```

## Change User Password

**Endpoint:** `PATCH /users/{id}/password`
**Auth Required:** Yes (Admin/Manager or own account)

### Request
```bash
curl -X PATCH http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174003/password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePass123!",
    "newPassword": "NewSecurePass456!"
  }'
```

### Response (200 OK)
```json
{
  "message": "Password updated successfully"
}
```

## Delete User

**Endpoint:** `DELETE /users/{id}`
**Auth Required:** Yes (Admin only)

### Request
```bash
curl -X DELETE http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174003 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Response (200 OK)
```json
{
  "message": "User deleted successfully"
}
```

## Get User Statistics

**Endpoint:** `GET /users/stats`
**Auth Required:** Yes (Admin/Manager only)

### Request
```bash
curl -X GET "http://localhost:3000/users/stats?dealershipId=123e4567-e89b-12d3-a456-426614174002" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Response (200 OK)
```json
{
  "totalUsers": 25,
  "activeUsers": 23,
  "inactiveUsers": 2,
  "roleDistribution": {
    "admin": 2,
    "manager": 5,
    "sales": 12,
    "service": 6
  },
  "recentlyCreated": 3
}
```

## Error Responses

### User Not Found (404)
```json
{
  "message": "User not found",
  "statusCode": 404,
  "timestamp": "2025-01-20T18:50:02.457Z",
  "path": "/users/invalid-id"
}
```

### Validation Error (400)
```json
{
  "message": "Validation failed",
  "statusCode": 400,
  "timestamp": "2025-01-20T18:50:02.457Z",
  "path": "/users",
  "details": [
    "email must be a valid email",
    "password must be at least 6 characters long"
  ]
}
```

### Insufficient Permissions (403)
```json
{
  "message": "Insufficient permissions",
  "statusCode": 403,
  "timestamp": "2025-01-20T18:50:02.457Z",
  "path": "/users"
}
```