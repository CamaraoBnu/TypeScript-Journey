import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  Default,
  AllowNull,
  CreatedAt,
} from "sequelize-typescript";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { User } from "./User";

@Table({
  tableName: "user_time_entries",
  timestamps: false,
})
export class TimeEntries extends Model<
  InferAttributes<TimeEntries>,
  InferCreationAttributes<TimeEntries>
> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @BelongsTo(() => User, { onDelete: "CASCADE" })
  declare user?: User;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  declare timeEntry: Date;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  declare created_at: CreationOptional<Date>;
}
