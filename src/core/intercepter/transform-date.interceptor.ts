import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable, map } from 'rxjs';
  import { DateTime } from 'luxon';
  
  function transformDates(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(transformDates);
    }
  
    if (obj instanceof Date) {
      return DateTime.fromJSDate(obj).setZone('Asia/Colombo').toISO();
    }
  
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        obj[key] = transformDates(obj[key]);
      }
    }
  
    return obj;
  }
  
  @Injectable()
  export class TransformDateInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(map((data) => transformDates(data)));
    }
  }
  