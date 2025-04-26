// src/shifts/dto/update-shift-date.dto.ts
import { IsEnum, IsOptional, IsNumber, Min, IsString, Matches } from 'class-validator';
import { ShiftType } from '../enums/shift-type.enum';
import { Type } from 'class-transformer';

export class UpdateShiftDateDto {
  @IsOptional()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, { message: 'Date must be in format dd-mm-yyyy' })
  date?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsOptional()
  @IsEnum(ShiftType)
  type?: ShiftType;

  @IsOptional()
  @IsString()
  id?: string;
}