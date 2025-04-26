import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { ShiftDate } from './shift-date.model';

@Table
export class Shift extends Model {
@Column({
  type: DataType.UUID,
  defaultValue: DataType.UUIDV4,
  primaryKey: true,
})
declare id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  description: string;

  @HasMany(() => ShiftDate)
  dates: ShiftDate[];
}
