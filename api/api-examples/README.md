# Motocorp DMS API Testing Guide

This directory contains comprehensive API testing examples and documentation for the Motocorp Dealership Management System.

## Quick Start

1. **Start the development server:**
   ```bash
   pnpm start:dev
   ```

2. **Import the OpenAPI specification into Postman:**
   - File: `../openapi.yaml`
   - Base URL: `http://localhost:3000`

3. **Run example requests:**
   - Use the provided example files in the `examples/` directory
   - Follow the authentication flow in `auth-flow.md`

## Directory Structure

```
api-examples/
├── README.md              # This file
├── auth-flow.md           # Authentication workflow examples
├── postman/               # Postman collection and environment
├── examples/              # Individual API request examples
└── test-data/            # Sample data for testing
```

## Authentication Required

Most endpoints require JWT authentication. Follow the authentication flow:

1. **Register an organization** (creates first admin user)
2. **Login with credentials** to get JWT token
3. **Use Bearer token** in subsequent requests

## Base URL

- Development: `http://localhost:3000`
- Production: `https://api.motocorp-dms.com`

## Quick Test Endpoints

### Health Check (No Auth Required)
```bash
curl http://localhost:3000/health
```

### API Welcome (No Auth Required)
```bash
curl http://localhost:3000/
```

### Register Organization (No Auth Required)
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@testdealership.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "organizationName": "Test Motorcycle Dealership"
  }'
```

## Testing Flow

1. **System Health**: Verify the API is running
2. **Authentication**: Register and login
3. **Core Resources**: Test CRUD operations
4. **Business Logic**: Test complex workflows
5. **Error Handling**: Test edge cases

## Common Headers

```
Content-Type: application/json
Authorization: Bearer <your-jwt-token>
```

## Error Responses

All error responses follow a consistent format:
```json
{
  "message": "Error description",
  "statusCode": 400,
  "timestamp": "2025-01-20T18:50:02.457Z",
  "path": "/api/endpoint",
  "details": ["Additional error details"]
}
```

## Support

- API Documentation: Available in `../openapi.yaml`
- Issues: Report at project repository
- Questions: Check the examples in this directory