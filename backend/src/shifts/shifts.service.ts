// src/shifts/shifts.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Shift } from './models/shift.model';
import { ShiftDate } from './models/shift-date.model';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftType } from './enums/shift-type.enum';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectModel(Shift)
    private shiftModel: typeof Shift,
    @InjectModel(ShiftDate)
    private shiftDateModel: typeof ShiftDate,
    private sequelize: Sequelize,
  ) {}

  // Helper function to validate and parse date
  private parseDate(dateString: string): Date {
    const dateParts = dateString.split('-');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // JS months are 0-indexed
    const year = parseInt(dateParts[2], 10);
    
    const date = new Date(year, month, day);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      throw new BadRequestException(`Invalid date: ${dateString}`);
    }
    
    return date;
  }

  // Helper function to validate times
  private validateTimes(startTime: string, endTime: string): void {
    // Convert time strings to comparable values
    const start = startTime.split(':').map(Number);
    const end = endTime.split(':').map(Number);
    
    const startValue = start[0] * 60 + start[1];
    const endValue = end[0] * 60 + end[1];
    
    if (startValue >= endValue) {
      throw new BadRequestException('End time must be after start time');
    }
  }

  async create(createShiftDto: CreateShiftDto): Promise<Shift> {
    const transaction: Transaction = await this.sequelize.transaction();
    
    try {
      // Validate dates and times
      if (createShiftDto.dates.length < 1 || createShiftDto.dates.length > 10) {
        throw new BadRequestException('Shift must have between 1 and 10 dates');
      }
      
      // Create the shift first
      const shift = await this.shiftModel.create(
        {
          title: createShiftDto.title,
          description: createShiftDto.description || null,
        },
        { transaction },
      );
      
      // Then create each shift date
      for (const dateDto of createShiftDto.dates) {
        // Validate start time is before end time
        this.validateTimes(dateDto.startTime, dateDto.endTime);
        
        // Parse date
        const parsedDate = this.parseDate(dateDto.date);
        
        await this.shiftDateModel.create(
          {
            shiftId: shift.id,
            date: parsedDate,
            startTime: dateDto.startTime,
            endTime: dateDto.endTime,
            price: dateDto.price,
            type: dateDto.type,
          },
          { transaction },
        );
      }
      
      await transaction.commit();
      
      // Get the complete shift with dates
      return this.findOne(shift.id);
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async findAll(): Promise<Shift[]> {
    return this.shiftModel.findAll({
      include: [ShiftDate],
    });
  }

  async findOne(id: string): Promise<Shift> {
    const shift = await this.shiftModel.findByPk(id, {
      include: [ShiftDate],
    });
    
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    
    return shift;
  }

  async update(id: string, updateShiftDto: UpdateShiftDto): Promise<Shift> {
    const transaction: Transaction = await this.sequelize.transaction();
    
    try {
      const shift = await this.shiftModel.findByPk(id, { transaction });
      
      if (!shift) {
        await transaction.rollback();
        throw new NotFoundException(`Shift with ID ${id} not found`);
      }
      
      // Update the shift itself if data provided
      if (updateShiftDto.title !== undefined || updateShiftDto.description !== undefined) {
        await shift.update({
          title: updateShiftDto.title !== undefined ? updateShiftDto.title : shift.title,
          description: updateShiftDto.description !== undefined ? updateShiftDto.description : shift.description,
        }, { transaction });
      }
      
      // Handle dates if provided
      if (updateShiftDto.dates && updateShiftDto.dates.length > 0) {
        // Get existing dates
        const existingDates = await this.shiftDateModel.findAll({
          where: { shiftId: id },
          transaction,
        });
        
        // For each date in the update DTO
        for (const dateDto of updateShiftDto.dates) {
          if (dateDto.id) {
            // This is an update to an existing date
            const existingDate = existingDates.find(d => d.id === dateDto.id);
            
            if (existingDate) {
              // If start time and end time are both provided, validate them
              if (dateDto.startTime && dateDto.endTime) {
                this.validateTimes(dateDto.startTime, dateDto.endTime);
              } else if (dateDto.startTime && !dateDto.endTime) {
                // If just start time is provided, validate against existing end time
                this.validateTimes(dateDto.startTime, existingDate.endTime.toString());
              } else if (!dateDto.startTime && dateDto.endTime) {
                // If just end time is provided, validate against existing start time
                this.validateTimes(existingDate.startTime.toString(), dateDto.endTime);
              }
              
              // Parse date if provided
              let parsedDate: Date | undefined = undefined;
if (dateDto.date) {
  parsedDate = this.parseDate(dateDto.date);
}
              
              // Update the existing date
              await existingDate.update({
                date: parsedDate !== undefined ? parsedDate : existingDate.date,
                startTime: dateDto.startTime || existingDate.startTime,
                endTime: dateDto.endTime || existingDate.endTime,
                price: dateDto.price !== undefined ? dateDto.price : existingDate.price,
                type: dateDto.type || existingDate.type,
              }, { transaction });
            }
          } else {
            // This is a new date to be added
            if (!dateDto.date || !dateDto.startTime || !dateDto.endTime || dateDto.type === undefined) {
              throw new BadRequestException('New dates must include date, startTime, endTime, and type');
            }
            
            // Validate times
            this.validateTimes(dateDto.startTime, dateDto.endTime);
            
            // Parse date
            const parsedDate = this.parseDate(dateDto.date);
            
            // Create a new date
            await this.shiftDateModel.create({
              shiftId: id,
              date: parsedDate,
              startTime: dateDto.startTime,
              endTime: dateDto.endTime,
              price: dateDto.price !== undefined ? dateDto.price : 0,
              type: dateDto.type,
            }, { transaction });
          }
        }
      }
      
      await transaction.commit();
      
      // Return the updated shift
      return this.findOne(id);
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const transaction: Transaction = await this.sequelize.transaction();
    
    try {
      const shift = await this.shiftModel.findByPk(id, { transaction });
      
      if (!shift) {
        await transaction.rollback();
        throw new NotFoundException(`Shift with ID ${id} not found`);
      }
      
      // Delete all associated dates first
      await this.shiftDateModel.destroy({
        where: { shiftId: id },
        transaction,
      });
      
      // Then delete the shift
      await shift.destroy({ transaction });
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}