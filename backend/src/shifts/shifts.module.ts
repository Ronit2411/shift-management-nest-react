// src/shifts/shifts.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { Shift } from './models/shift.model';
import { ShiftDate } from './models/shift-date.model';

@Module({
  imports: [SequelizeModule.forFeature([Shift, ShiftDate])],
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [ShiftsService],
})
export class ShiftsModule {}