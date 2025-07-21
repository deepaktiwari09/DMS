import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const reply = ctx.getResponse();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'An error occurred';
    let details: string[] = [];

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      
      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object') {
        message = (response as any).message || 'An error occurred';
        details = (response as any).details || [];
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      // Handle Prisma-specific errors
      const prismaError = this.handlePrismaError(exception);
      status = prismaError.status;
      message = prismaError.message;
      details = prismaError.details;
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Unknown error occurred';
    }

    // Log the error with context
    const errorLog = {
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      message,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      userId: (request as any).user?.userId,
      organizationId: (request as any).user?.organizationId,
    };

    if (status >= 500) {
      this.logger.error(errorLog, exception instanceof Error ? exception.stack : undefined);
    } else {
      this.logger.warn(errorLog);
    }

    // Send standardized error response
    const errorResponse = {
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(details.length > 0 && { details }),
    };

    reply.status(status).send(errorResponse);
  }

  private handlePrismaError(error: PrismaClientKnownRequestError): {
    status: number;
    message: string;
    details: string[];
  } {
    switch (error.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          message: 'A record with this data already exists',
          details: [`Unique constraint failed: ${error.meta?.target}`],
        };
      case 'P2014':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid data provided',
          details: ['The change you are trying to make would violate a required relation'],
        };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid reference',
          details: ['Foreign key constraint failed'],
        };
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          details: ['The requested record does not exist'],
        };
      case 'P2016':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Query interpretation error',
          details: ['The provided query is invalid'],
        };
      case 'P2021':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Table not found',
          details: ['The requested table does not exist in the database'],
        };
      case 'P2022':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Column not found',
          details: ['The requested column does not exist in the database'],
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error occurred',
          details: [error.message],
        };
    }
  }
}