# Health Check Endpoints

These endpoints allow you to verify the system status and don't require authentication.

## System Health Check

**Endpoint:** `GET /health`
**Auth Required:** No

Returns comprehensive system health information.

### Request
```bash
curl -X GET http://localhost:3000/health
```

### Response (200 OK - Healthy)
```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T18:50:02.457Z",
  "uptime": 3600.5,
  "memory": {
    "rss": 106053632,
    "heapTotal": 57688064,
    "heapUsed": 28760728,
    "external": 2451145,
    "arrayBuffers": 17167
  },
  "services": {
    "database": true
  },
  "version": "1.0.0"
}
```

### Response (503 Service Unavailable - Unhealthy)
```json
{
  "status": "unhealthy",
  "timestamp": "2025-01-20T18:50:02.457Z",
  "uptime": 3600.5,
  "memory": {
    "rss": 106053632,
    "heapTotal": 57688064,
    "heapUsed": 28760728,
    "external": 2451145,
    "arrayBuffers": 17167
  },
  "services": {
    "database": false
  },
  "version": "1.0.0"
}
```

## Database Health Check

**Endpoint:** `GET /health/database`
**Auth Required:** No

Returns database-specific health information.

### Request
```bash
curl -X GET http://localhost:3000/health/database
```

### Response (200 OK - Database Healthy)
```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T18:50:02.457Z"
}
```

### Response (503 Service Unavailable - Database Issues)
```json
{
  "status": "unhealthy",
  "timestamp": "2025-01-20T18:50:02.457Z"
}
```

## API Welcome

**Endpoint:** `GET /`
**Auth Required:** No

Returns a simple welcome message to verify the API is responding.

### Request
```bash
curl -X GET http://localhost:3000/
```

### Response (200 OK)
```
Hello World!
```

## Using Health Checks

### For Monitoring
- Use `/health` for comprehensive system monitoring
- Set up alerts when status changes to "unhealthy"
- Monitor memory usage trends
- Track uptime for SLA reporting

### For Load Balancers
- Use `/health` as a health check endpoint
- Configure load balancer to remove unhealthy instances
- Set appropriate timeout and retry policies

### For CI/CD
- Use health checks to verify deployment success
- Wait for healthy status before routing traffic
- Include in smoke tests and integration test suites

### Example Monitoring Script
```bash
#!/bin/bash
HEALTH_URL="http://localhost:3000/health"
RESPONSE=$(curl -s "$HEALTH_URL")
STATUS=$(echo "$RESPONSE" | jq -r '.status')

if [ "$STATUS" = "healthy" ]; then
    echo "✅ System is healthy"
    exit 0
else
    echo "❌ System is unhealthy"
    echo "$RESPONSE"
    exit 1
fi
```