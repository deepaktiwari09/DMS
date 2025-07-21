# Authentication Flow Examples

This document provides step-by-step examples for authenticating with the Motocorp DMS API.

## 1. Register New Organization

**Endpoint:** `POST /auth/register`
**Auth Required:** No

Creates a new organization with the first admin user.

### Request
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example-dealership.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "organizationName": "Example Motorcycle Dealership"
  }'
```

### Response (201 Created)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "admin@example-dealership.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "organizationId": "123e4567-e89b-12d3-a456-426614174001"
  }
}
```

**Save the `accessToken` for subsequent requests!**

## 2. Login Existing User

**Endpoint:** `POST /auth/login`
**Auth Required:** No

Authenticates an existing user and returns a fresh JWT token.

### Request
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example-dealership.com",
    "password": "SecurePass123!"
  }'
```

### Response (200 OK)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "admin@example-dealership.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "organizationId": "123e4567-e89b-12d3-a456-426614174001"
  }
}
```

## 3. Get User Profile

**Endpoint:** `GET /auth/profile`
**Auth Required:** Yes

Returns the current authenticated user's profile and tenant context.

### Request
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Response (200 OK)
```json
{
  "user": {
    "organizationId": "123e4567-e89b-12d3-a456-426614174001",
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "role": "admin",
    "permissions": ["read", "write", "admin"],
    "subscriptionTier": "starter",
    "databaseName": "tenant_org_abc123"
  }
}
```

## 4. Refresh Token

**Endpoint:** `POST /auth/refresh`
**Auth Required:** Yes

Refreshes the JWT token for continued API access.

### Request
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Response (200 OK)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "admin@example-dealership.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "organizationId": "123e4567-e89b-12d3-a456-426614174001"
  }
}
```

## Using the Token

Once you have an access token, include it in the Authorization header for all protected endpoints:

```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

## Token Expiration

- JWT tokens have a limited lifetime
- When a token expires, you'll receive a 401 Unauthorized response
- Use the refresh endpoint to get a new token
- For security, tokens should be refreshed regularly

## Error Responses

### Invalid Credentials (401)
```json
{
  "message": "Invalid email or password",
  "statusCode": 401,
  "timestamp": "2025-01-20T18:50:02.457Z",
  "path": "/auth/login"
}
```

### Validation Error (400)
```json
{
  "message": "Validation failed",
  "statusCode": 400,
  "timestamp": "2025-01-20T18:50:02.457Z",
  "path": "/auth/register",
  "details": [
    "email must be a valid email",
    "password must be at least 6 characters long"
  ]
}
```

### User Already Exists (400)
```json
{
  "message": "User with this email already exists",
  "statusCode": 400,
  "timestamp": "2025-01-20T18:50:02.457Z",
  "path": "/auth/register"
}
```