import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Shift } from './shift.model';
import { ShiftType } from '../enums/shift-type.enum';

@Table
export class ShiftDate extends Model {
@Column({
  type: DataType.UUID,
  defaultValue: DataType.UUIDV4,
  primaryKey: true,
})
declare id: string;

  @ForeignKey(() => Shift)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  shiftId: string;

  @BelongsTo(() => Shift)
  shift: Shift;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  date: Date;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  startTime: Date;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  endTime: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  price: number;

  @Column({
    type: DataType.ENUM(...Object.values(ShiftType)),
    allowNull: false,
  })
  type: ShiftType;
}
