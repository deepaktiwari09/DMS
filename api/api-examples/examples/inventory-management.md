# Inventory Management Examples

Examples for managing inventory with advanced filtering and custom views.

**Prerequisites:** You must be authenticated and have appropriate permissions.

## List Inventory Items

**Endpoint:** `GET /inventory`
**Auth Required:** Yes

### Basic Request
```bash
curl -X GET "http://localhost:3000/inventory" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### With Advanced Filters
```bash
curl -X GET "http://localhost:3000/inventory?search=yamaha&category=motorcycle&lowStock=true&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Yamaha MT-07",
      "sku": "YAM-MT07-2024",
      "category": "motorcycle",
      "price": 7499.99,
      "stock": 5,
      "minStock": 2,
      "description": "Lightweight naked bike with 689cc engine",
      "specifications": {
        "engine": "689cc parallel twin",
        "power": "74hp",
        "weight": "184kg"
      },
      "images": ["url1.jpg", "url2.jpg"],
      "createdAt": "2025-01-20T18:50:02.457Z"
    }
  ],
  "meta": {
    "total": 350,
    "page": 1,
    "limit": 20,
    "totalPages": 18
  }
}
```

## Create Inventory Item

**Endpoint:** `POST /inventory`
**Auth Required:** Yes (Manager/Admin only)

### Request
```bash
curl -X POST http://localhost:3000/inventory \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Honda CB650R",
    "sku": "HON-CB650R-2024",
    "category": "motorcycle",
    "price": 8999.99,
    "stock": 3,
    "minStock": 1,
    "description": "Neo Sports Café with aggressive styling",
    "specifications": {
      "engine": "649cc inline-4",
      "power": "94hp",
      "weight": "202kg"
    },
    "dealershipId": "123e4567-e89b-12d3-a456-426614174002"
  }'
```

### Response (201 Created)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "name": "Honda CB650R",
  "sku": "HON-CB650R-2024",
  "category": "motorcycle",
  "price": 8999.99,
  "stock": 3,
  "minStock": 1,
  "description": "Neo Sports Café with aggressive styling",
  "specifications": {
    "engine": "649cc inline-4",
    "power": "94hp",
    "weight": "202kg"
  },
  "organizationId": "123e4567-e89b-12d3-a456-426614174010",
  "dealershipId": "123e4567-e89b-12d3-a456-426614174002",
  "createdAt": "2025-01-20T18:50:02.457Z"
}
```

## Update Stock Levels

**Endpoint:** `PATCH /inventory/{id}/stock`
**Auth Required:** Yes

### Add Stock
```bash
curl -X PATCH http://localhost:3000/inventory/123e4567-e89b-12d3-a456-426614174001/stock \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "add",
    "quantity": 5,
    "reason": "New shipment received"
  }'
```

### Subtract Stock
```bash
curl -X PATCH http://localhost:3000/inventory/123e4567-e89b-12d3-a456-426614174001/stock \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "subtract",
    "quantity": 1,
    "reason": "Sold to customer"
  }'
```

### Set Stock Level
```bash
curl -X PATCH http://localhost:3000/inventory/123e4567-e89b-12d3-a456-426614174001/stock \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "set",
    "quantity": 10,
    "reason": "Stock count adjustment"
  }'
```

### Response (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "name": "Honda CB650R",
  "stock": 8,
  "previousStock": 3,
  "operation": "add",
  "quantity": 5,
  "reason": "New shipment received",
  "updatedAt": "2025-01-20T19:00:02.457Z"
}
```

## Custom Views Management

### Create Custom View

**Endpoint:** `POST /inventory/views`
**Auth Required:** Yes

```bash
curl -X POST http://localhost:3000/inventory/views \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Low Stock Motorcycles",
    "description": "All motorcycles with stock below minimum",
    "filterConfig": {
      "category": "motorcycle",
      "lowStock": true
    },
    "sortConfig": {
      "field": "stock",
      "direction": "asc"
    },
    "groupConfig": {
      "field": "category"
    },
    "isShared": false
  }'
```

### Response (201 Created)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174005",
  "name": "Low Stock Motorcycles",
  "description": "All motorcycles with stock below minimum",
  "filterConfig": {
    "category": "motorcycle",
    "lowStock": true
  },
  "sortConfig": {
    "field": "stock",
    "direction": "asc"
  },
  "groupConfig": {
    "field": "category"
  },
  "isShared": false,
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "createdAt": "2025-01-20T18:50:02.457Z"
}
```

### Get User's Custom Views

**Endpoint:** `GET /inventory/views`
**Auth Required:** Yes

```bash
curl -X GET http://localhost:3000/inventory/views \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174005",
      "name": "Low Stock Motorcycles",
      "description": "All motorcycles with stock below minimum",
      "isShared": false,
      "createdAt": "2025-01-20T18:50:02.457Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

### Apply Custom View

**Endpoint:** `GET /inventory/views/{viewId}/apply`
**Auth Required:** Yes

```bash
curl -X GET http://localhost:3000/inventory/views/123e4567-e89b-12d3-a456-426614174005/apply \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Response (200 OK)
```json
{
  "view": {
    "id": "123e4567-e89b-12d3-a456-426614174005",
    "name": "Low Stock Motorcycles",
    "description": "All motorcycles with stock below minimum"
  },
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Yamaha MT-07",
      "stock": 1,
      "minStock": 2,
      "category": "motorcycle"
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

## Low Stock Alerts

**Endpoint:** `GET /inventory/low-stock`
**Auth Required:** Yes

```bash
curl -X GET "http://localhost:3000/inventory/low-stock?dealershipId=123e4567-e89b-12d3-a456-426614174002" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Yamaha MT-07",
      "sku": "YAM-MT07-2024",
      "stock": 1,
      "minStock": 2,
      "stockDeficit": 1,
      "category": "motorcycle"
    }
  ],
  "alertCount": 3,
  "totalValue": 22499.97
}
```

## Inventory Analytics

**Endpoint:** `GET /inventory/analytics`
**Auth Required:** Yes

```bash
curl -X GET "http://localhost:3000/inventory/analytics?dealershipId=123e4567-e89b-12d3-a456-426614174002" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Response (200 OK)
```json
{
  "totalItems": 350,
  "totalValue": 2450000.00,
  "lowStockItems": 12,
  "outOfStockItems": 3,
  "categoryBreakdown": {
    "motorcycle": 150,
    "parts": 180,
    "accessories": 20
  },
  "averagePrice": 7000.00,
  "topCategories": [
    {
      "category": "parts",
      "count": 180,
      "value": 540000.00
    },
    {
      "category": "motorcycle",
      "count": 150,
      "value": 1800000.00
    }
  ]
}
```

## Error Responses

### Item Not Found (404)
```json
{
  "message": "Inventory item not found",
  "statusCode": 404,
  "timestamp": "2025-01-20T18:50:02.457Z",
  "path": "/inventory/invalid-id"
}
```

### Insufficient Stock (400)
```json
{
  "message": "Insufficient stock for operation",
  "statusCode": 400,
  "timestamp": "2025-01-20T18:50:02.457Z",
  "path": "/inventory/123e4567-e89b-12d3-a456-426614174001/stock",
  "details": [
    "Requested quantity: 10",
    "Available stock: 3"
  ]
}
```

### Duplicate SKU (409)
```json
{
  "message": "A record with this data already exists",
  "statusCode": 409,
  "timestamp": "2025-01-20T18:50:02.457Z",
  "path": "/inventory",
  "details": ["Unique constraint failed: sku"]
}
```