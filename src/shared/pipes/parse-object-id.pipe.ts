import { Types } from 'mongoose';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PraseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!Types.ObjectId.isValid(value))
      throw new BadRequestException('Invalid Object Id');

    return value;
  }
}
