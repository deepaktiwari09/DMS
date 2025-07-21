import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: any, res: any, next: NextFunction) {
    const { method, url, headers, body, query } = req;
    const startTime = Date.now();
    const userAgent = headers['user-agent'] || '';
    const ip = req.ip || req.connection.remoteAddress;
    
    // Extract user context if available
    const userId = req.user?.userId;
    const organizationId = req.user?.organizationId;

    // Log incoming request
    const requestLog = {
      timestamp: new Date().toISOString(),
      method,
      url,
      userAgent,
      ip,
      ...(userId && { userId }),
      ...(organizationId && { organizationId }),
      ...(Object.keys(query).length > 0 && { query }),
      ...(method !== 'GET' && body && Object.keys(body).length > 0 && { 
        body: this.sanitizeBody(body) 
      }),
    };

    this.logger.log(`→ ${method} ${url}`, JSON.stringify(requestLog, null, 2));

    // Capture the original response methods
    const originalSend = res.send;
    const originalJson = res.json;

    // Override response methods to log the response
    res.send = function(data: any) {
      const duration = Date.now() - startTime;
      const responseLog = {
        timestamp: new Date().toISOString(),
        method,
        url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ...(userId && { userId }),
        ...(organizationId && { organizationId }),
        responseSize: Buffer.byteLength(JSON.stringify(data), 'utf8'),
      };

      // Log response based on status code
      if (res.statusCode >= 400) {
        this.logger.error(`← ${method} ${url} ${res.statusCode}`, JSON.stringify(responseLog, null, 2));
      } else {
        this.logger.log(`← ${method} ${url} ${res.statusCode}`, JSON.stringify(responseLog, null, 2));
      }

      return originalSend.call(this, data);
    }.bind(this);

    res.json = function(data: any) {
      const duration = Date.now() - startTime;
      const responseLog = {
        timestamp: new Date().toISOString(),
        method,
        url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ...(userId && { userId }),
        ...(organizationId && { organizationId }),
        responseSize: Buffer.byteLength(JSON.stringify(data), 'utf8'),
      };

      // Log response based on status code
      if (res.statusCode >= 400) {
        this.logger.error(`← ${method} ${url} ${res.statusCode}`, JSON.stringify(responseLog, null, 2));
      } else {
        this.logger.log(`← ${method} ${url} ${res.statusCode}`, JSON.stringify(responseLog, null, 2));
      }

      return originalJson.call(this, data);
    }.bind(this);

    next();
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = [
      'password',
      'token',
      'secret',
      'key',
      'auth',
      'authorization',
      'credential',
      'pass',
      'pwd',
    ];

    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    // Handle nested objects
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeBody(sanitized[key]);
      }
    }

    return sanitized;
  }
}