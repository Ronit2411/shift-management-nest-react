// src/shifts/dto/create-shift.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateShiftDateDto } from './create-shift-date.dto';

export class CreateShiftDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateShiftDateDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  dates: CreateShiftDateDto[];
}
