// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ShiftsModule } from './shifts/shifts.module';

@Module({
  imports: [DatabaseModule, ShiftsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}