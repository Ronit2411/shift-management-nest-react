import { IsOptional, IsString, MaxLength, ValidateNested, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateShiftDateDto } from './update-shift-date.dto';

export class UpdateShiftDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateShiftDateDto)
  @ArrayMaxSize(10)
  dates?: UpdateShiftDateDto[];
}