import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface ExceptionErrorBody {
  message: string | string[];
  statusCode: number;
  error?: any;
}

@Catch()
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Get Response
    const res = host.switchToHttp().getResponse<Response>();

    // Exception Response to be returned
    let exceptionReponse: ExceptionErrorBody = {
      message: 'Unable to perform this action',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    if (exception instanceof HttpException) {
      exceptionReponse = this.handleHttpException(exception);
    } else if (exception['name'] === 'MongoServerError') {
      exceptionReponse = this.handleMongoException(exception);
    } else if (
      ['JsonWebTokenError', 'TokenExpiredError'].includes(exception['name'])
    ) {
      // Get Request
      const req = host.switchToHttp().getRequest<Request>();

      exceptionReponse = this.handleJWTException(exception, req);
    }

    console.log(exception);

    return this.sendErrorBackToClient(exceptionReponse, res);
  }

  //#region Http Error Handler
  private handleHttpException(exception: HttpException): ExceptionErrorBody {
    const statusCode = exception.getStatus();

    // If Error is thrown by handler
    if (statusCode >= 400 && statusCode < 500) {
      const exceptionReponse: ExceptionErrorBody =
        exception.getResponse() as ExceptionErrorBody;

      exceptionReponse.error = exception?.cause ?? undefined;

      return exceptionReponse;
    }
  }
  //#endregion

  //#region Mongo Error Handler
  private handleMongoException(exception: MongoError): ExceptionErrorBody {
    if (exception.code === 11000) {
      return this.handleDuplicateKey(exception);
    }
  }

  private handleDuplicateKey(exception: MongoError | any): ExceptionErrorBody {
    const message = exception.keyValue?.email
      ? 'email is already exists!'
      : Object.keys(exception.keyValue).map(
          (key) => `${key} is already exists!`,
        );
    return {
      message,
      statusCode: HttpStatus.BAD_REQUEST,
    };
  }
  //#endregion

  //#region Handle JWT Error
  private handleJWTException(exception: any, req: Request): ExceptionErrorBody {
    if (
      req.url.includes('forget-password/verify') ||
      req.url.includes('set-password')
    ) {
      return {
        message: 'Invalid link',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    return {
      message: 'Unauthorized',
      statusCode: HttpStatus.UNAUTHORIZED,
    };
  }
  //#endregion

  private sendErrorBackToClient(
    exceptionReponse: ExceptionErrorBody,
    res: Response,
  ) {
    return res.status(exceptionReponse.statusCode).json({
      error: {
        statusCode: exceptionReponse.statusCode,
        message: exceptionReponse.message,
        error: exceptionReponse?.error ?? undefined,
      },
    });
  }
}
