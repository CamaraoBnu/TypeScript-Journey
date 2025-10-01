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
import { TimeEntryStatus } from "../enums/TimeEntryStatus";

@Table({
  tableName: "user_time_entries",
  timestamps: false,
})
export class TimeEntry extends Model<
  InferAttributes<TimeEntry>,
  InferCreationAttributes<TimeEntry>
> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: CreationOptional<number>;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare created_by_id: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  declare approved_by_id: number;

  @BelongsTo(() => User, { onDelete: "CASCADE" })
  declare user?: User;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  declare timeEntry: Date;

  @Default(TimeEntryStatus.ACTIVE)
  @Column(DataType.ENUM(...Object.values(TimeEntryStatus)))
  declare status: TimeEntryStatus;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  declare created_at: CreationOptional<Date>;
}
