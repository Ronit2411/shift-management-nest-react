// src/shifts/dto/create-shift-date.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  Matches,
  IsDateString,
} from 'class-validator';
import { ShiftType } from '../enums/shift-type.enum';
import { Type } from 'class-transformer';

export class CreateShiftDateDto {
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'Date must be in format dd-mm-yyyy',
  })
  date: string;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsEnum(ShiftType)
  type: ShiftType;
}
