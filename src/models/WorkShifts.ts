import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  Unique,
  Default,
} from "sequelize-typescript";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import { User } from "../models/User";

@Table({
  tableName: "work_shifts",
  timestamps: true,
})
export class WorkShifts extends Model<
  InferAttributes<WorkShifts>,
  InferCreationAttributes<WorkShifts>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @ForeignKey(() => User)
  @Unique
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare user_id: number;

  @BelongsTo(() => User, { onDelete: "CASCADE" })
  declare user?: User;

  @Column({ type: DataType.TIME, allowNull: false })
  declare expected_start_time: string;

  @Column({ type: DataType.TIME, allowNull: false })
  declare expected_end_time: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare break_minutes: number;
}
