// src/shifts/shifts.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './models/shift.model';

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createShiftDto: CreateShiftDto): Promise<Shift> {
    return this.shiftsService.create(createShiftDto);
  }

  @Get()
  findAll(): Promise<Shift[]> {
    return this.shiftsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Shift> {
    return this.shiftsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto): Promise<Shift> {
    return this.shiftsService.update(id, updateShiftDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.shiftsService.remove(id);
  }
}