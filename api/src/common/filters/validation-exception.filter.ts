import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const reply = ctx.getResponse();

    const response = exception.getResponse() as any;
    const status = exception.getStatus();

    // Extract validation errors from class-validator
    let message = 'Validation failed';
    let details: string[] = [];

    if (typeof response === 'object') {
      if (response.message) {
        if (Array.isArray(response.message)) {
          details = response.message;
          message = 'Validation failed';
        } else {
          message = response.message;
        }
      }
    }

    // Log validation error
    this.logger.warn({
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      message: 'Validation error',
      validationErrors: details,
      body: request.body,
      userId: (request as any).user?.userId,
      organizationId: (request as any).user?.organizationId,
    });

    // Send standardized validation error response
    const errorResponse = {
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      details,
    };

    reply.status(status).send(errorResponse);
  }
}